import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/Courzelo_Quizz/Shared/entities/Quiz';
import { approvalService } from 'src/app/Courzelo_Quizz/Shared/services/approvalService ';
import { QuizService } from 'src/app/Courzelo_Quizz/Shared/services/quiz.service';
import { Formation } from '../../Shared/entities/Formation';
import { FormationService } from '../../Shared/services/formation.service';

@Component({
  selector: 'app-assessments-trainee',
  templateUrl: './assessments-trainee.component.html',
  styleUrls: ['./assessments-trainee.component.css']
})
export class AssessmentsTraineeComponent implements OnInit {
  
  quiz!:Quiz[];
  idFormation:any
  formation:any;
  displayedColumns = ['title','Link'];
  constructor(private appService:approvalService,private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private quizservice : QuizService,
    private formationService:FormationService) { }

  public dataSource= new  MatTableDataSource<Quiz>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  ngOnInit(): void {
    this.idFormation=localStorage.getItem('idFormation1')
    this.GetQuizByFormation()
  }


  SortChange(sortState: any) {
  
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
 public doFilter = (value: string) => {
   
    this.dataSource.filter = value.trim().toLocaleLowerCase();

  }


  GetQuizByFormation(){
    var i=0
    this.formationService.getFormationsById(this.idFormation).subscribe((res:Formation)=>{
      this.quiz=[] as Quiz[]
      console.log(res.idQuiz)
      
        res.idQuiz.map(e=>{
          this.quizservice.getquizbyid(e).subscribe(r=>{
            this.quiz.push(r)
             i++
             if(i==res.idQuiz.length){
              console.log(this.quiz)
              this.dataSource = new  MatTableDataSource<Quiz>(this.quiz);
              this.dataSource.paginator=this.paginator 
             }
           })
          })
      })
      
  }


  view(id:any){
    this.router.navigate( ["sidebar/espaceformation/quiz/"+id]);
  }
}
