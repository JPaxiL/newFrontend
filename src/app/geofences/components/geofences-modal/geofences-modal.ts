export interface Modales{
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: RatingProps;
}

interface RatingProps{
    rate:number;
    count:number;
}
export interface Datas {
    name: string;
    description: string;
    coordinates: string;
    color: string;
}