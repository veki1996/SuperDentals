import { useEffect } from 'react';
import parse from 'html-react-parser';

const QuillReader = ({ description }) => {
	useEffect(() => {
		//Transform string to html format and then add tailwind css tags
		const renderQuill = () => {
			addTailwindClasses();
		};
		renderQuill();
	}, [description]);

	//
	const addTailwindClasses = () => {
		let olList = document.getElementById('quill-reader').getElementsByTagName('ol');
		let unList = document.getElementById('quill-reader').getElementsByTagName('ul');
		let h1Tags = document.getElementById('quill-reader').getElementsByTagName('h1');
		let h2Tags = document.getElementById('quill-reader').getElementsByTagName('h2');

		if (olList.length > 0) {
			for (let lista of olList) {
				lista.classList.add('list-decimal');
				lista.classList.add('ml-8');
			}
		}
		if (unList.length > 0) {
			for (let lista of unList) {
				lista.classList.add('list-disc');
				lista.classList.add('ml-8');
			}
		}
		if (h1Tags.length > 0) {
			for (let h1 of h1Tags) {
				h1.classList.add('text-2xl');
			}
		}

		if (h2Tags.length > 0) {
			for (let h2 of h2Tags) {
				h2.classList.add('text-xl');
			}
		}
	};

	return (
		<div id="login" className="">
			<div id="quill-reader">{parse(description)}</div>
		</div>
	);
};

export default QuillReader;
