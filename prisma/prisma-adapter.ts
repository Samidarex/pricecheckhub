import { ItemStatus, Item } from '@prisma/client';
import prisma from './prisma';
import { ItemModel } from './models/ItemModel';

export async function addItemToDatabase(itemModel: ItemModel): Promise<void> {
    // Check if an item re
    const dbItem = await findItemByLink(itemModel.link);

    if (dbItem != null) {
        const updateRequired = await isUpdateRequired(dbItem);

        if (updateRequired) {
            await prisma.item.update({
                where: { link: itemModel.link },
                data: { price: itemModel.price, status: ItemStatus.UPDATED },
            });
        }
        else
        {
            console.log(`Skipping item ${dbItem.name}, listing already exists!`);
        }
    }
    else {
        // If no item with the same link exists, add the new item to the database
        await prisma.item.create({
            data: itemModel,
        });
        console.log('Item added to the database:', itemModel);
    }
}

export async function isUpdateRequired(dbItem: Item): Promise<boolean> {
    if (dbItem != null) {
        if (dbItem.lastUpdated) {
            const lastUpdateThreshold = new Date();
            lastUpdateThreshold.setHours(lastUpdateThreshold.getHours() - 72);

            // Check if the last update is older than 72 hours
            if (dbItem.lastUpdated < lastUpdateThreshold) {
                // Update the status property to "REQUIRES_FETCH"
                //TODO: maybe make the price update here, instead of making another transaction?
                prisma.item.update({
                    where: { link: dbItem.link },
                    data: { status: 'REQUIRES_FETCH' },
                });
                return true;
            }
        }
    }
    return false;
}

async function findItemByLink(link: string): Promise<Item | null> {
    const existingItem: Item | null = await prisma.item.findUnique({
        where: {
            link: link,
        },
    });
    return existingItem;
}

// Close the Prisma client connection when done
export async function closePrismaConnection(): Promise<void> {
    await prisma.$disconnect();
}
