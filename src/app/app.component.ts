import { Component } from '@angular/core';

interface Post {
  // Define the structure of your Post object
  id: number;
  title: any;
  content: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'it_elec_6a'; 
  storedPosts: Post[] = [];
  onPostAdded(post: any): void{
    this.storedPosts.push(post);
  }  
  // storedPosts = [];

  // onPostAdded(post){
  //   this.storedPosts.push(post)
  // }

}
