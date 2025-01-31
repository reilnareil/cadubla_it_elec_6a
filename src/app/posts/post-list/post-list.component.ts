import { Component } from "@angular/core";
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent{
    posts = [
        {title: '1st title', content: '1st content'},
        {title: '2nd title', content: '2nd content'},
        {title: '3rd title', content: '3rd content'},
    ]
} 