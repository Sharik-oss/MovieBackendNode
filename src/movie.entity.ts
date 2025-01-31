import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Movie{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    active!: boolean;
    
    @Column()
    movie_url!: string;
    
    @Column()
    name!: string;
    
    @Column()
    poster!: string;

    @Column({
        nullable: true
    })
    year!: string;

    @Column({
        nullable: true
    })
    genre!: string;

    @Column({
        nullable: true
    })
    movieType!: string;

    @Column({
        nullable: true
    })
    resolution!: string;
}