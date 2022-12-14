import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Comment } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/entities/Comment';
import { FileUpload } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/entities/file';
import { Post } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/entities/Post';
import { CommentService } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/services/comment.service';
import { FileUploadService } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/services/file-upload.service';
import { FormationService } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/services/formation.service';
import { PostService } from 'src/app/Courzelo_Classroom/Courzelo_Classroom_Trainee/Shared/services/post.service';
import { User } from 'src/app/Courzelo_Core/Modules/Entity/user';
import { TokenStorageService } from 'src/app/Courzelo_Core/Shared/Service/token-storage.service';
import { ModalUpdatePostComponent } from '../modal-update-post/modal-update-post.component';

@Component({
  selector: 'app-flux-trainer',
  templateUrl: './flux-trainer.component.html',
  styleUrls: ['./flux-trainer.component.css']
})


export class FluxTrainerComponent implements OnInit {
post =new Post()
posts!:Post[]
test11!:any
selectedFile!:File
privateEtat!:any
comment!:any
important!:any
v!:any
imagetest!:boolean
user!:any
retrievedImage: any;
test=false
base64Data:any; 
commentA =new Comment()
comments!:Comment[]
test1!:any
valueTest!:any
color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  currentuser: User | any;
index:any;
nbComments=0;
selectedFiles?: FileList;
currentFileUpload?: FileUpload;
percentage = 0;



file = new File(["images"], "images.png", {
  type: "image/png",
});
 id =localStorage.getItem("idFormation1")
  constructor(private postService:PostService,
    private userService:FormationService,
    private diag: MatDialog, 
    private commentService:CommentService,
    private tokenService:TokenStorageService,
    private uploadService: FileUploadService,
    private storage: AngularFireStorage
    ) {

     }

  ngOnInit(): void {
this.currentuser = this.tokenService.getUser();
    this.v="primary"
    
    this.getpostbyid()
  
    
  }
  public onFileChanged(event:any) {
    //Select File
    this.valueTest=true
    this.selectedFile = event.target.files[0];
    
  }
  public onFileChanged2(event:any) {
    //Select File
    this.valueTest=false
    this.selectedFile = event.target.files[0];
    

  }
    selectFile(event: any): void {
      this.selectedFiles = event.target.files;
    }
    upload(): void {
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        //this.selectedFiles = undefined;
        if (file) {
          this.currentFileUpload = new FileUpload(file);
          this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
            (percentage:any) => {
              this.percentage = Math.round(percentage ? percentage : 0);
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    }

  
  onValChange(value:any){
    this.privateEtat=value.checked 
}
onValChange1(value:any){
  this.comment=value.checked 
}
onValChange3(value:any){
  this.important=value.checked 
}

  addPost(){
   
    const uploadImageData = new FormData();
    this.post.stateprivate=this.privateEtat
    this.post.comment=this.comment
    this.post.important=this.important
    this.post.test=this.valueTest
    
    

    if(this.selectedFiles==null){
      
      // uploadImageData.append('imageFile',this.file );
       this.post.typefile = null;
       
       }
       else {
         const filePath = `${this.uploadService.basePath}/${this.currentFileUpload?.file.name}`;
       const storageRef = this.storage.ref(filePath);
        // uploadImageData.append('imageFile',this.selectedFile );
          storageRef.getDownloadURL().subscribe(d => {this.post.typefile = d;
           const user=this.post;
       uploadImageData.append('user',JSON.stringify(user));
       
       this.postService.addPosts(this.currentuser.id,this.id,uploadImageData).subscribe(res=>{
        this.getpostbyid()
      })
       
         });
         
       }

    

  }
  username:String[] = [];
  getpostbyid(){
    this.getComment
    this.postService.getPostsByIdFormation(this.id).subscribe((res:Post[])=>{
      this.posts=res
      console.log(this.posts)
      this.posts.forEach(p => {
        this.commentService.getcommentuserById(p.iduser).subscribe((c:any) => {
          this.username.push(c.displayName)
        })
      })
      
      
      
        
    })
      
      
         
  }

  updatepostpublic(id:any){
    this.postService.updatePostsprivate(id,true).subscribe(res=>{

    })
  }



  deletePost(id:any){
    this.postService.deletePostById(id).subscribe(res=>{
      this.getpostbyid()
    })
  }
  
  AddPostDialog(id:any) {
  localStorage.setItem("idPost",id);
    const diagref = this.diag.open(ModalUpdatePostComponent, {
      width: '700px',
      height: '600px',
      
     
      disableClose: true,
    }) .afterClosed().subscribe((res => {
      this.ngOnInit
    }));;
   
  }

  SocialSharing(id:any) {
    localStorage.setItem("idPost",id);
      const diagref = this.diag.open(ModalUpdatePostComponent, {
        width: '700px',
        height: '600px',
        
       
        disableClose: true,
      }) .afterClosed().subscribe((res => {
        this.ngOnInit
      }));;
     
    }

  uploadFile(){
    this.test=!this.test
  }
  uploadFile1(){
    this.test11=!this.test11
  }








getComment(id:any,i:any){
  
 this.index = i
  this.commentService.getCommentsByIdPost(id).subscribe((res:Comment[])=>{
    this.posts[this.index].comments=res
   // this.nbComments=res.length
    this.posts[this.index].comments.forEach(c=>{
      this.commentService.getcommentuserById(c.idUser).subscribe(
        (res:User | any) => {
          c.displayName = res.displayName
        } 
        
      )
    })
    // this.getComment(id)
   
  })
}




  addComment(id:any,index:any)
  {

    this.commentService.addComments(this.currentuser.id,id,this.commentA).subscribe(res=>{
    this.commentA.commentContent =''
    this.getComment(id,index)
    

    })
  }

  deleteCommentById(id:any,index:any,idpost:any){
    this.commentService.deleteCommentById(id).subscribe(res=>{
      this.getComment(idpost,index)
    })
  }


  imageisnull(j:any):boolean{
    if (j != null && (j.includes(".png") || j.includes(".PNG") || j.includes(".jpg"))){
      return true;
    }
    else {return false;}
}
videoisnull(j:any):boolean{
  if (j != null && j.includes(".mp4")){
    return true;
  }
  else {return false;}
}
pdfisnull(j:any):boolean{

if (j != null && (j.includes(".pdf"))){ 
  
  return true;
}
else {return false;}
}
}
