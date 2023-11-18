import { ItemStatus, ItemRefresh} from '@prisma/client';
import prisma from './prisma';
import { ItemModel } from './models/ItemModel';

export async function addItemsToDatabase(itemModels: ItemModel[]): Promise<void> {
    if (itemModels != null && itemModels.length > 0) {

        const itemLinks: string[] = itemModels.map(item => item.link);
        const dbItems: ItemRefresh[] | null = await findItemsByLink(itemLinks);

        await prisma.$transaction(async (prisma) => {
            if (dbItems != null && dbItems.length > 0) {
                const updateList: string[] = await getUpdateItemList(dbItems);

                if (updateList != null) {
                    // Find common links between itemModels and updateList
                    const commonLinks: string[] = updateList.filter(link => itemLinks.includes(link));

                    if (commonLinks.length > 0) {
                        for (const link of commonLinks) {
                            const itemToUpdate = itemModels.find(item => item.link === link);

                            if (itemToUpdate) {
                                await prisma.item.upsert({
                                    where: { link: link },
                                    update: {
                                        lastUpdated: new Date(Date.now()).toISOString(),
                                        price: itemToUpdate.price,
                                        status: ItemStatus.UPDATED,
                                    },
                                    create: itemToUpdate
                                });
                            }
                        }
                    } else {
                        console.log(`Skipping items ${itemModels.length}, listings already exist!`);
                    }
                } else {
                    console.log(`Skipping items ${itemModels.length}, listings already exist!`);
                }
            } else {
                console.log(itemModels);
                // If no item with the same link exists, add the new item to the database
                await prisma.item.createMany({
                    data: itemModels,
                });
                const refreshItems: Omit<ItemModel, 'name' | 'image' | 'itemRefreshLink' | 'price'>[] = itemModels.map(({ name, image, itemRefreshLink, price, ...rest }) => rest);
                await prisma.itemRefresh.createMany({
                    data: refreshItems
                })
                console.log('Items added to the database:', itemModels.length);
            }
        });
    }
}

export async function getUpdateItemList(dbItems: ItemRefresh[]): Promise<string[]> {
    const lastUpdateThreshold = new Date();
    lastUpdateThreshold.setHours(lastUpdateThreshold.getHours() - 72);

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
    const existingItem: ItemRefresh[] | null = await prisma.item.findMany({
        where: {
            link: {
                in: links,
            }
        },
    });
    return existingItem;
}

// Close the Prisma client connection when done
export async function closePrismaConnection(): Promise<void> {
    await prisma.$disconnect();
}
