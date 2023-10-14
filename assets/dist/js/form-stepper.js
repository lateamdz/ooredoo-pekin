const classToggle=(element,classes={})=>{
    Object.entries(classes).forEach(([className,condition])=>{
        if(condition){
            element.classList.add(className)
        }else{
            element.classList.remove(className)
        }
    });
};

class FormStepper{
    id;
    props={
        global:{
            hideNextOnLastStep:false,
            hidePrevOnLastStep:false,
            defaultNextText:'Suivant',
            defaultPrevText:'Precedent',
        },
        1:{
            prevText:'Precedent',
            nextText:'Suivant',
            onSubmit:(data)=>{
                console.log(data)
            }
        }
    };
    headerItems;
    prevBtn;
    nextBtn;
    stepCount;
    currentStep=1;
    constructor(id,props) {
        this.id=id;
        this.props=props;

        this.headerItems=document.getElementById(this.id).getElementsByClassName("form-stepper-count");
        this.prevBtn=document.getElementById(this.id).querySelector('[data-role="prev"]');
        this.nextBtn=document.getElementById(this.id).querySelector('[data-role="next"]');
        this.stepCount=this.headerItems.length;
        // elements.forEach(function(element) {
        //     // Do something with 'element'
        // });
        this.useEffect();
        console.log(this.nextBtn,this.prevBtn);
    }

    useEffect(){
        classToggle(this.nextBtn,{
            "d-none": this.currentStep===this.stepCount?this.props.global.hideNextOnLastStep:this.currentStep>=this.stepCount
        });
        classToggle(this.prevBtn,{
            "d-none":this.currentStep===this.stepCount?this.props.global.hidePrevOnLastStep:this.currentStep<=1
        });
        this.nextBtn.onclick=()=>{
            if(this.currentStep<this.stepCount){
                this.currentStep++;
                console.log(this.currentStep);
                this.useEffect();
            }
        };

        this.prevBtn.onclick=()=>{
            if(this.currentStep>1){
                this.currentStep--;
                console.log(this.currentStep);
                this.useEffect();
            }
        };

        this.nextBtn.innerHTML=this.props[this.currentStep]?.nextText|| this.props.global.defaultNextText;
        this.prevBtn.innerHTML=this.props[this.currentStep]?.prevText|| this.props.global.defaultPrevText;
        for(let i=1;i<this.stepCount;i++){
            classToggle(this.headerItems[i],{
                "passed": this.currentStep>i
            });

        }
    }

}