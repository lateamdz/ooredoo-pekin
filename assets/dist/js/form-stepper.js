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
        },
        1: {
            prevText: 'Precedent',
            nextText: 'Suivant',
            onSubmit: (data) => {
                console.log(data)
            },
            form:{
                // firstName:{
                //     initial:"Sami",
                //     validation:(form)=>true,
                // }
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
                this.setInputData(this.contentItems[i - 1],i)
            }
        }

        this.nextBtn.onclick = () => {
            if (this.props[this.currentStep] && this.props[this.currentStep].onSubmit) {
                this.props[this.currentStep].onSubmit(this.formData);
            }
            if (this.currentStep < this.stepCount) {
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
        const childInputs=currentItem.getElementsByTagName("input");
        const inputData={};
        for(let input of childInputs){
            inputData[input.name]=["checkbox","radio"].includes(input.type)?input.checked:input.type==="file"?input.files[0]:input.value;
        }
        this.formData[step]=inputData
    }
}