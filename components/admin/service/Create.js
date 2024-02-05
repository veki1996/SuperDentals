import { useState } from 'react';
import FinalStep from './FinalStep';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';

const Create = ({ modal }) => {
	// States
	const [firstStep, setFirstStep] = useState(true);
	const [secondStep, setSecondStep] = useState(false);
	const [thirdStep, setThirdStep] = useState(false);
	const [namesData, setNamesData] = useState({});
	const [descriptionsData, setDescriptionsData] = useState({});

	return (
		<div>
			<div className="m-auto">
				<div className="flex justify-center w-full">
					<ul className="steps transition-all w-full">
						<li
							className={`step ${
								firstStep || secondStep || thirdStep ? 'step-primary' : ''
							} after:transition-all before:transition-all duration-300`}
						>
							Names
						</li>
						<li
							className={`step ${
								secondStep || thirdStep ? 'step-primary' : ''
							} after:transition-all before:transition-all duration-300`}
						>
							Descriptions
						</li>
						<li
							className={`step ${thirdStep && 'step-primary'} after:transition-all before:transition-all duration-300`}
						>
							Final Step
						</li>
					</ul>
				</div>
				{firstStep && (
					<FirstStep setFirstStep={setFirstStep} setSecondStep={setSecondStep} setNamesData={setNamesData} />
				)}
				{secondStep && (
					<SecondStep
						setSecondStep={setSecondStep}
						setThirdStep={setThirdStep}
						setDescriptionsData={setDescriptionsData}
					/>
				)}
				{thirdStep && <FinalStep modal={modal} namesData={namesData} descriptionsData={descriptionsData} />}
			</div>
		</div>
	);
};

export default Create;
