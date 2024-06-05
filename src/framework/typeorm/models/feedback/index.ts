import { Entity, Index, Column } from 'typeorm';
import { BaseModel } from '../base';
import { FeedbackEntity } from 'src/core';

@Entity('feedbacks')
@Index(['firstName', 'lastName', 'phone', 'email'], {
  fulltext: true,
})
export class Feedback extends BaseModel implements FeedbackEntity {
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true, type: 'text' })
  message: string;
}
