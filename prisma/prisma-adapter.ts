import { ItemStatus, ItemRefresh, Item } from '@prisma/client';
import prisma from './prisma';
import { ItemModel } from './models/ItemModel';
import { cacheService } from '../caching/cacheService';

const HOURS_THRESHOLD = 72;

async function getStaleLinks(): Promise<string[]> {
    const lastUpdateThreshold = new Date();
    lastUpdateThreshold.setHours(lastUpdateThreshold.getHours() - HOURS_THRESHOLD);

    const updateLinks = await prisma.itemRefresh.findMany({
        where: {
            lastUpdated: {
                lt: lastUpdateThreshold,
            },
        },
        select: {
            link: true,
        },
    });

    return updateLinks.map(item => item.link);
}

async function findItemsByLink(links: string[]): Promise<ItemRefresh[] | null> {
    const cachedItems = await Promise.all(links.map(link => cacheService.get<ItemRefresh | null>(link)));

    const missingLinks = links.filter((link, index) => cachedItems[index] === null);

    if (cachedItems) {
        console.log("Got cached items:", cachedItems.length);
        return cachedItems
            .filter(item => item !== null) as ItemRefresh[];
    }

    const dbItems = (await prisma.item.findMany({
        where: {
            link: {
                in: missingLinks,
            },
        },
    })) as ItemRefresh[];

    return dbItems;
}

async function updateExistingItems(itemModels: ItemModel[], dbItems: ItemRefresh[]): Promise<void> {
    const updateList: string[] = await getStaleLinks();
    const unAddedItems: ItemModel[] = [];

    for (const item of itemModels) {
        const linkExistsInDb = dbItems.some(dbItem => dbItem.link === item.link);

        if (linkExistsInDb) {
            if (updateList.includes(item.link)) {
                await prisma.item.upsert({
                    where: { link: item.link },
                    update: {
                        lastUpdated: new Date(Date.now()).toISOString(),
                        price: item.price,
                        status: ItemStatus.UPDATED,
                    },
                    create: item,
                });
                console.log("Item updated succesfully", item.name);
            }
            console.log(`Skipping ${item.name}, listing already exist!`)
            continue;
        } else {
            unAddedItems.push(item);
        }
    }

    if (unAddedItems.length > 0) {
        console.log(unAddedItems);
        addItemsToCollections(unAddedItems);
    }
}

async function addItemsToCollections(items: ItemModel[]): Promise<void> {
    await prisma.item.createMany({
        data: items,
    });

    await Promise.all(
        items.map(item => cacheService.set(item.link, item, 60 * 60 * 72))
    );

    const refreshItems: Omit<ItemModel, 'name' | 'image' | 'itemRefreshLink' | 'price' | 'oldPrice' | 'isAvailable'>[] = items.map(({ name, image, itemRefreshLink, price, oldPrice, isAvailable, ...rest }) => rest);

    await prisma.itemRefresh.createMany({
        data: refreshItems,
    });

    await Promise.all(
        refreshItems.map(refreshItem => cacheService.set(refreshItem.link, refreshItem, 60 * 60 * 72))
    );
    console.log('Cached items: ', items.length);
}

export async function addItemsToDatabase(itemModels: ItemModel[]): Promise<void> {
    if (itemModels == null || itemModels.length === 0) {
        return;
    }

    const itemLinks: string[] = itemModels.map(item => item.link);
    const dbItems: ItemRefresh[] | null = await findItemsByLink(itemLinks);

    if (dbItems != null && dbItems.length > 0) {
        await updateExistingItems(itemModels, dbItems);
    } else {
        console.log(itemModels);
        addItemsToCollections(itemModels);
        console.log('Items added to the database:', itemModels.length);
    }
}

export async function closePrismaConnection(): Promise<void> {
    await prisma.$disconnect();
}