import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/Courzelo_Core/Shared/Service/token-storage.service';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-classroommeet',
  templateUrl: './classroommeet.component.html',
  styleUrls: ['./classroommeet.component.css']
})
export class ClassroommeetComponent implements OnInit ,AfterViewInit {

  domain: string = "meet.jit.si";
    room: any;
    options: any;
    api: any;
    user: any;
url:any;
    // For Custom Controls
    isAudioMuted = false;
    isVideoMuted = false;
    
    test!:boolean;
    constructor(
        private router: Router,private tokenService:TokenStorageService
    ) { }

    ngOnInit(): void {
      this.test = false;
       
         
 

    }
  
    ngAfterViewInit(): void {
      this.options = {
        roomName: this.room,
        width: 900,
        height: 500,
        configOverwrite: { prejoinPageEnabled: false,defaultLanguage: "en" },
        interfaceConfigOverwrite: {
            // overwrite interface properties
        },
        parentNode: document.querySelector('#jitsi-iframe'),
        userInfo: {
            displayName: this.tokenService.getUser().displayName
        }
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    console.log(this.api)
    
    this.api.getLivestreamUrl().then((livestreamData:any) => {
       console.log(livestreamData)
      
  });
    this.api.addEventListeners({
        readyToClose: this.handleClose,
        participantLeft: this.handleParticipantLeft,
        participantJoined: this.handleParticipantJoined,
        videoConferenceJoined: this.handleVideoConferenceJoined,
        videoConferenceLeft: this.handleVideoConferenceLeft,
        audioMuteStatusChanged: this.handleMuteStatus,
        videoMuteStatusChanged: this.handleVideoStatus
    });
    }


    handleClose = () => {
        console.log("handleClose");
    }

    handleParticipantLeft = async (participant: any) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }

    handleParticipantJoined = async (participant:any) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }

    handleVideoConferenceJoined = async (participant:any) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await this.getParticipants();
    }

    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        this.router.navigate(['/thank-you']);
    }

    handleMuteStatus = (audio:any) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    handleVideoStatus = (video:any) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    executeCommand(command: string) {
        this.api.executeCommand(command);;
        if(command == 'hangup') {
            this.router.navigate(['/']);
            return;
        }

        if(command == 'toggleAudio') {
            this.isAudioMuted = !this.isAudioMuted;
        }

        if(command == 'toggleVideo') {
            this.isVideoMuted = !this.isVideoMuted;
        }
    }


}
