import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export class Ad{
    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    name!: string;


    @Column()
    imgUrl!: string;
    
    
    @Column()
    startDate!:  Date;

    @Column()
    endDate!: Date;


    @Column()
    active!: boolean;

}