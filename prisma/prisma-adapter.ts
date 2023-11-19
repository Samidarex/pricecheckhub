import { ItemStatus, ItemRefresh, Item } from '@prisma/client';
import prisma from './prisma';
import { ItemModel } from './models/ItemModel';

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
    return prisma.item.findMany({
        where: {
            link: {
                in: links,
            },
        },
    });
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

    const refreshItems: Omit<ItemModel, 'name' | 'image' | 'itemRefreshLink' | 'price' | 'oldPrice' | 'isAvailable'>[] = items.map(({ name, image, itemRefreshLink, price, oldPrice, isAvailable, ...rest }) => rest);

    await prisma.itemRefresh.createMany({
        data: refreshItems,
    });
}

export async function addItemsToDatabase(itemModels: ItemModel[]): Promise<void> {
    if (itemModels == null || itemModels.length === 0) {
        return;
    }

    const itemLinks: string[] = itemModels.map(item => item.link);
    const dbItems: ItemRefresh[] | null = await findItemsByLink(itemLinks);

    await prisma.$transaction(async (prisma) => {
        if (dbItems != null && dbItems.length > 0) {
            await updateExistingItems(itemModels, dbItems);
        } else {
            console.log(itemModels);
            addItemsToCollections(itemModels);
            console.log('Items added to the database:', itemModels.length);
        }
    });
}

export async function closePrismaConnection(): Promise<void> {
    await prisma.$disconnect();
}