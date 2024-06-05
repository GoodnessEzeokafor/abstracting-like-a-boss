import { Injectable } from '@nestjs/common';
import { FeedbackEntity } from 'src/core';

@Injectable()
export class FeedbackFactoryServices {
  create(data: Partial<FeedbackEntity>) {
    const feedback = new FeedbackEntity();
    if (data.email) feedback.email = data.email;
    if (data.firstName)
      feedback.firstName = data.firstName.toLowerCase().trim();
    if (data.lastName) feedback.lastName = data.lastName.toLowerCase().trim();
    if (data.fullName) feedback.fullName = data.fullName.toLowerCase().trim();
    if (data.phone) feedback.phone = data.phone.trim();
    if (data.message) feedback.message = data.message.trim();
    if (data.subject) feedback.subject = data.subject.trim();

    return feedback;
  }
}
