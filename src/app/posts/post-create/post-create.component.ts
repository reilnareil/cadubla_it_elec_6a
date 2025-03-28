import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
// import { FilePickerService } from './file-picker.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId?: any;
  post: Post;
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {
    this.post = {} as Post;
  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
      'content': new FormControl('', { validators: [Validators.required] }),
      'image': new FormControl('', { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath

            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement | any).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image")?.updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    // if (this.form.invalid) {
    //   console.log("save");
    //   return;
    // }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      console.log("save");
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  };
}
