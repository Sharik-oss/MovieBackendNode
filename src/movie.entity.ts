import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Movie{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    movie_geo!: string;
    
    @Column()
    movie_name!: string;
    
    @Column()
    name!: string;
    
    @Column()
    poster!: string;
}