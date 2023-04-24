import { LightningElement,track} from 'lwc';
import { subscribe, unsubscribe, onError}  from 'lightning/empApi';
import fetchEvent from "@salesforce/apex/KanbanClass.fetchEvent";
import updateEvents from "@salesforce/apex/KanbanClass.updateEvents";
import getDetails from "@salesforce/apex/KanbanClass.getDetails";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class KanbanBoard extends LightningElement {

    @track data = [];
    @track finaldata=[];
    error;
    recId;
    selId;
    isShowModal=false;
    isViewModal=false;
    isEditModal=false;
    updateList=[];
    @track showDetails=[];

    subscription = {};
    CHANNEL_NAME = '/event/Kanban_platform_Event__e';


    connectedCallback() {
       // this.data=[];
        //this.finaldata=[];
        this.getEvents();
        subscribe(this.CHANNEL_NAME, -1, this.manageEvent).then(response => {
            console.log('Subscribed Channel');
            this.subscription = response;
        });
        onError(error => {
            console.error('Server Error--->'+error);
        });
    }

    manageEvent = event=> {

        const refreshRecordEvent = event.data.payload;
        this.data=[];
        this.finaldata=[];
        console.log('Event--->'+JSON.stringify(refreshRecordEvent));
       // if (refreshRecordEvent.Record_Id__c === this.recordId) {
            this.getEvents();
       // }
        
    }

    getEvents() {
        this.data=[];
        this.finaldata=[];
        fetchEvent()
            .then(result => {
                this.data = result;
                this.error = undefined;
                console.log('Events : ',JSON.stringify(this.data));
                this.data.forEach(item=>
                {
                    console.log('OUTPUT : ',item);
                    console.log('OUTPUT : for each entered');
                    let stage={};
                    if(item.Stages__c=='New Alerts')
                    {
                        stage['New_Alerts']=true;
                        stage['Preliminary_Review']=false;
                        stage['InProgress_Inspection']=false;
                        stage['Completed']=false;
                        stage['False_Alarm']=false;
                    }
                    else if(item.Stages__c=='Preliminary Review')
                    {
                        stage['New_Alerts']=false;
                        stage['Preliminary_Review']=true;
                        stage['InProgress_Inspection']=false;
                        stage['Completed']=false;
                        stage['False_Alarm']=false;
                    }
                    else if(item.Stages__c=='InProgress-Inspection')
                    {
                        stage['New_Alerts']=false;
                        stage['Preliminary_Review']=false;
                        stage['InProgress_Inspection']=true;
                        stage['Completed']=false;
                        stage['False_Alarm']=false;
                    }
                    else if(item.Stages__c=='Completed')
                    {
                        console.log('OUTPUT : enter completed elif');
                        stage['New_Alerts']=false;
                        stage['Preliminary_Review']=false;
                        stage['InProgress_Inspection']=false;
                        stage['Completed']=true;
                        stage['False_Alarm']=false;
                    }
                    else if(item.Stages__c=='False Alarm')
                    {
                        stage['New_Alerts']=false;
                        stage['Preliminary_Review']=false;
                        stage['InProgress_Inspection']=false;
                        stage['Completed']=false;
                        stage['False_Alarm']=true;
                    }
                    let j={
                        'Id':item.Id,
                        'Name':item.Name,
                        'Account':item.Account__c,
                        'Stages':stage,
                        'Criticalness':item.Criticalness__c
                    };
                    this.finaldata.push(j);
                    
                });
               console.log('OUTPUT : ',JSON.stringify(this.finaldata));
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }

    dragFun()
    {
       console.log('OUTPUT : dragged event',event.target.title);
       this.selId=event.target.title;
       console.log('OUTPUT : selId',this.selId);
    }

    allowDrop()
    {
        event.preventDefault();
    }

    dropFun()
    {
        this.updateList=[];
        // event.preventDefault();
        let stage=event.target.title;
        console.log('drop OUTPUT : ',event.target.title);
        this.updateList.push({
            'Id':this.selId,
            'Stages__c':stage
        });

        
        updateEvents({evList:this.updateList}).then(()=>{
            console.log('OUTPUT : updated');
            this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Event Dropped',
                        variant: 'success'
                    })
                );
        }).catch(error=>{
            console.log('OUTPUT : error');
            this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: 'Record not dropped',
                        variant: 'error'
                    })
                );
        });
    }




    clickFun()
    {
        this.recId=event.target.dataset.id;
        console.log('OUTPUT : ',this.recId);
        this.isShowModal=true;
        this.showDetails=[];
         getDetails({recId:this.recId}).then(result=>{

            this.showDetails=result;
            console.log('OUTPUT : ',JSON.stringify(this.showDetails));

        }).catch(error=>{

            console.log('OUTPUT : error');
        });
    }

    viewModalFun()
    {
        this.isShowModal=false;
        this.isViewModal=true;
    }

    editModalFun()
    {
        this.isShowModal=false;
        this.isEditModal=true;
    }

    hideModalBox()
    {
        this.isShowModal=false;
    }

    hideViewModalBox(){
        this.isViewModal=false;
    }

    hideEditModalBox(){
        this.isEditModal=false;
    }

    saveEditModalRecord()
    {
        console.log('OUTPUT : save button');
        let description=this.template.querySelector('[data-id="desc"]').value;
        console.log('OUTPUT : ',description);
        this.updateList=[];
        this.updateList.push({
            'Id':this.recId,
            'Description__c':description
        });
        updateEvents({evList:this.updateList}).then(()=>{
            console.log('OUTPUT : updated');
            this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Event Description Added',
                        variant: 'success'
                    })
                );
        }).catch(error=>{
            console.log('OUTPUT : error');
            this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: 'Event Description Not Added',
                        variant: 'error'
                    })
                );
        });
        this.isEditModal=false;
        
    }




    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
            console.log('Unsubscribed Channel');
        });
    }

}