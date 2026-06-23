import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Rating } from './rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  name !: string;

  @Column({ unique: true })
  email !: string;

  @Column({ length: 400 })
  address !: string;

  @OneToOne(() => User, (user) => user.ownedStore, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner !: User;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings !: Rating[];
}