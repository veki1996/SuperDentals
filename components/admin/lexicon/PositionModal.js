const HeadingModal = ({ toggleModal, position, setPosition }) => {
	return (
		<>
			<div className={`${toggleModal ? 'block' : 'hidden'}`}>
				<div className="mt-5 justify-center items-center flex">
					{/*content*/}
					<div className="relative flex flex-col w-full ">
						{/*header*/}
						<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
							<h3 className="text-3xl font-semibold">
								Position on{' '}
								{toggleModal === 'rs'
									? 'serbian'
									: toggleModal === 'ba'
									? 'bosnian'
									: toggleModal === 'hr'
									? 'croatian'
									: toggleModal === 'me'
									? 'montenegrin'
									: toggleModal === 'si'
									? 'slovenian'
									: toggleModal === 'gb'
									? 'english'
									: toggleModal === 'de'
									? 'german'
									: 'italian'}
							</h3>
						</div>
						{/*body*/}
						<div className="relative p-6 flex-auto">
							<select
								className="select select-secondary mt-1 mb-3 w-full"
								placeholder="Select Position in Lexicon"
								onChange={(e) => setPosition(e.target.value)}
								value={position}
							>
								<option value="" className="invisible">
									Select Position
								</option>
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
								<option value="D">D</option>
								<option value="E">E</option>
								<option value="F">F</option>
								<option value="G">G</option>
								<option value="H">H</option>
								<option value="I">I</option>
								<option value="J">J</option>
								<option value="K">K</option>
								<option value="L">L</option>
								<option value="M">M</option>
								<option value="N">N</option>
								<option value="O">O</option>
								<option value="P">P</option>
								<option value="Q">Q</option>
								<option value="R">R</option>
								<option value="S">S</option>
								<option value="T">T</option>
								<option value="U">U</option>
								<option value="V">V</option>
								<option value="W">W</option>
								<option value="X">X</option>
								<option value="Y">Y</option>
								<option value="Z">Z</option>
								<option value="#">#</option>
							</select>
						</div>
						{/*footer*/}
					</div>
				</div>
			</div>
		</>
	);
};

export default HeadingModal;
