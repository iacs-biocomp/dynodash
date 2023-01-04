import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  getHTML(user : any): string {
    const { userId, username} = user;
    return `
    <li>
        <p>
            <h5 class="text-success"> ${ username } </h5>
            <span class="fs-6 text-muted">${ userId }</span>
        </p>
    </li>
`;
  }
}
