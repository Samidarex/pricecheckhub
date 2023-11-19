export interface ItemModel{
    name: string,
    image: string,
    price: number,
    link: string,
    itemRefreshLink: string,
    oldPrice?: number,
    isAvailable: boolean
}