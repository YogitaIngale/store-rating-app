import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Rating } from '../stores/rating.entity';
import { Store } from '../stores/store.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  name !: string;

  @Column({ unique: true })
  email !: string;

  @Column()
  password !: string;

  @Column({ length: 400 })
  address !: string;

  @Column({ type: 'enum', enum: ['Admin', 'User', 'Owner'], default: 'User' })
  role !: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings !: Rating[];

  @OneToOne(() => Store, (store) => store.owner)
  ownedStore !: Store;
}