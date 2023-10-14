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
    contentItems;
    prevBtn;
    nextBtn;
    stepCount;
    currentStep=1;
    constructor(id,props) {
        this.id=id;
        this.props=props;

        this.headerItems=document.getElementById(this.id).getElementsByClassName("form-stepper-count");
        this.contentItems=document.getElementById(this.id).getElementsByClassName("form-stepper-content-step");
        this.prevBtn=document.getElementById(this.id).querySelector('[data-role="prev"]');
        this.nextBtn=document.getElementById(this.id).querySelector('[data-role="next"]');
        this.stepCount=this.headerItems.length;
        // elements.forEach(function(element) {
        //     // Do something with 'element'
        // });
        this.useEffect();
    }

    useEffect(){
        classToggle(this.nextBtn,{
            "d-none": this.currentStep===this.stepCount?this.props.global.hideNextOnLastStep:this.currentStep>=this.stepCount
        });
        classToggle(this.prevBtn,{
            "d-none":this.currentStep===this.stepCount?this.props.global.hidePrevOnLastStep:this.currentStep<=1
        });


        this.nextBtn.innerHTML=this.props[this.currentStep]?.nextText|| this.props.global.defaultNextText;
        this.prevBtn.innerHTML=this.props[this.currentStep]?.prevText|| this.props.global.defaultPrevText;

        for(let i=1;i<=this.stepCount;i++){
            classToggle(this.headerItems[i-1],{
                "passed": i<=this.currentStep
            });
        }

        for(let i=1;i<=this.stepCount;i++){
            classToggle(this.contentItems[i-1],{
                "d-none": i!==this.currentStep
            });
        }

        this.nextBtn.onclick=()=>{
            if(this.currentStep<this.stepCount){
                this.currentStep++;
                this.useEffect();
            }
        };

        this.prevBtn.onclick=()=>{
            if(this.currentStep>1){
                this.currentStep--;
                this.useEffect();
            }
        };
    }

}