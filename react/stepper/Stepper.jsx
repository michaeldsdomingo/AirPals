import React from "react";
import PropTypes from "prop-types";
import logger from "../file_upload/node_modules/sabio-debug";
import "./stepper.scss";

const _logger = logger.extend("Stepper");

_logger("From Stepper");
export default class Stepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
    };
  }

  componentDidMount() {
    this.initializeSteps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStepNumber !== this.props.currentStepNumber) {
      const { steps } = this.state;
      const currentSteps = this.updateStep(
        this.props.currentStepNumber - 1,
        steps
      );
      this.setState({
        steps: currentSteps,
      });
    }
    if (prevProps.steps !== this.props.steps) {
      this.initializeSteps();
    }
  }

  updateStep(stepNumber, steps) {
    const newSteps = [...steps];

    let stepCounter = 0;

    while (stepCounter < newSteps.length) {
      if (stepCounter === stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: true,
          selected: true,
          completed: false,
          current: true,
        };
      } else if (stepCounter < stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: true,
          completed: true,
        };
      } else {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: false,
          completed: false,
        };
      }
      stepCounter++;
    }

    return newSteps;
  }

  initializeSteps = () => {
    const { steps, currentStepNumber } = this.props;
    _logger(steps);
    const stepsState = steps.map((step, index) => {
      const stepObj = {};
      stepObj.description = step;
      stepObj.completed = false;
      stepObj.selected = index === 0 ? true : false;
      stepObj.highlighted = index === 0 ? true : false;

      return stepObj;
    });

    const currentSteps = this.updateStep(currentStepNumber - 1, stepsState);

    this.setState({ steps: currentSteps });
  };

  render() {
    const { direction } = this.props;
    const { steps } = this.state;
    const stepsDisplay = steps.map((step, index) => {
      return (
        <div className="step-wrapper" key={index}>
          <div className="step-number-description-container">
            <div
              className={`step-number step-number-${
                this.props.verticalStepSize
              } ${
                step.selected ? "step-number-active" : "step-number-disabled"
              } ${
                step.current && this.props.isProgress
                  ? "step-number-current"
                  : ""
              }`}
            >
              {!this.props.isProgress &&
                (step.completed ? <span>&#10003;</span> : index + 1)}
            </div>
            <div
              className={`step-description ${
                step.highlighted && "step-description-active"
              }`}
            >
              <div className={!step.selected ? `faded` : undefined }>{step.description}</div>
            </div>
          </div>
          <div className="step-content-container pl-3">
            {index === this.props.currentStepNumber - 1 &&
              direction === "vertical" && (
                <div>
                  {this.props.displayForms(this.props.currentStepNumber)}
                </div>
              )}
          </div>
          <div
            className={
              index !== steps.length - 1
                ? `divider-line ${
                    this.props.isProgress ? `divider-line-progress` : ``
                  } divider-line-${steps.length}`
                : undefined
            }
          ></div>
        </div>
      );
    });

    return (
      <>
        <div className={`stepper-wrapper-${direction} inStepper`}>
          {stepsDisplay}
        </div>
        {direction === "horizontal" && (
          <div className="form-container mt-5 inOfStepper">
            {this.props.displayForms(this.props.currentStepNumber)}
          </div>
        )}
      </>
    );
  }
}
Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  ).isRequired,
  direction: PropTypes.string.isRequired,
  currentStepNumber: PropTypes.number.isRequired,
  displayForms: PropTypes.func.isRequired,
  verticalStepSize: PropTypes.string.isRequired,
  isProgress: PropTypes.bool,
};