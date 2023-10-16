const classToggle = (element, classes = {}) => {
    Object.entries(classes).forEach(([className, condition]) => {
        if (condition) {
            element.classList.add(className)
        } else {
            element.classList.remove(className)
        }
    });
};

class FormStepper {
    id;
    props = {
        global: {
            hideNextOnLastStep: false,
            hidePrevOnLastStep: false,
            defaultNextText: 'Suivant',
            defaultPrevText: 'Precedent',
            onStepChange:(step)=>{}
        },
        1: {
            prevText: 'Precedent',
            nextText: 'Suivant',
            onSubmit: (data) => {
                console.log(data)
            },
            isValidForm:false,
            form:{
                default:{
                    validation:(value,form)=>true,
                }
            }
        }
    };
    headerItems;
    contentItems;
    prevBtn;
    nextBtn;
    stepCount;
    currentStep = 1;

    formData = {};
    nextBtnIsClicked=false;

    constructor(id, props) {
        this.id = id;
        this.props = props;

        this.headerItems = document.getElementById(this.id).getElementsByClassName("form-stepper-count");
        this.contentItems = document.getElementById(this.id).getElementsByClassName("form-stepper-content-step");
        this.prevBtn = document.getElementById(this.id).querySelector('[data-role="prev"]');
        this.nextBtn = document.getElementById(this.id).querySelector('[data-role="next"]');
        this.stepCount = this.headerItems.length;

        this.useEffect();
    }

    useEffect() {
        this.props.global.onStepChange && this.props.global.onStepChange(this.currentStep);
        if(this.props[this.currentStep]){
            const formData=this.props[this.currentStep].form||{default:{valid:true}};
            this.props[this.currentStep].isValidForm=Object.entries(formData).every(([key,value])=>value.valid);
        }

        classToggle(this.nextBtn, {
            "d-none": this.currentStep === this.stepCount ? this.props.global.hideNextOnLastStep : this.currentStep >= this.stepCount
        });
        classToggle(this.prevBtn, {
            "d-none": this.currentStep === this.stepCount ? this.props.global.hidePrevOnLastStep : this.currentStep <= 1
        });


        this.nextBtn.innerHTML = this.props[this.currentStep]?.nextText || this.props.global.defaultNextText;
        this.prevBtn.innerHTML = this.props[this.currentStep]?.prevText || this.props.global.defaultPrevText;

        for (let i = 1; i <= this.stepCount; i++) {
            classToggle(this.headerItems[i - 1], {
                "passed": i <= this.currentStep
            });
            this.headerItems[i - 1].setAttribute('data-step-number', i)
        }

        for (let i = 1; i <= this.stepCount; i++) {
            classToggle(this.contentItems[i - 1], {
                "d-none": i !== this.currentStep
            });
            this.contentItems[i - 1].setAttribute('data-step-content', i);

            if(i===this.currentStep){
                this.setInputData(this.contentItems[i - 1],i);
            }
        }

        this.nextBtn.onclick = () => {
            const formValid= this.props[this.currentStep]?this.props[this.currentStep].isValidForm:true;
            this.nextBtnIsClicked=true;
            if (this.props[this.currentStep] && this.props[this.currentStep].onSubmit && formValid ) {
                this.props[this.currentStep].onSubmit(this.formData);
            }

            if (this.currentStep < this.stepCount && formValid) {
                this.nextBtnIsClicked=false;
                this.currentStep++;
            }
            this.useEffect();

        };

        this.prevBtn.onclick = () => {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
            this.useEffect();
        };
    }

    setInputData(currentItem,step){
        const getValue=(input)=>{
            if(input.type==="date"){
                const date_parts = input.value.split("-");
                const year = parseInt(date_parts[0]);
                const month = parseInt(date_parts[1]);
                const day = parseInt(date_parts[2]);
                return `${day}/${month}/${year}`
            }
            else
              return ["checkbox","radio"].includes(input.type)?input.checked:input.type==="file"?input.files[0]:input.value
        };
        const childInputs=[...currentItem.getElementsByTagName("input"),...currentItem.getElementsByTagName("select"),...currentItem.getElementsByTagName("textarea")];
        const inputData={};
        for(let input of childInputs){
            inputData[input.name]=getValue(input);
            const onchange=(e)=>{
                let isValid=true;
                const validation=this.props[step].form[input.name] && this.props[step].form[input.name].validation;
                if(validation){
                    isValid=validation(getValue(e.target),inputData);
                }
                classToggle(input.nextElementSibling, {
                    "d-block": !isValid && this.nextBtnIsClicked
                });
                this.props[step].form[input.name]={...this.props[step].form[input.name],valid:isValid};

            };

            input.onchange=(e)=>{
                onchange(e);
                this.useEffect();
            };
             onchange({target:input});
        }
        this.formData[step]=inputData
    }
}