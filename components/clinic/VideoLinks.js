import { useFieldArray } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';

const PhoneNumbers = ({ register, control, errors }) => {
	const {
		fields: videoFields,
		append: videoAppend,
		remove: videoRemove,
	} = useFieldArray({
		control,
		name: 'videoLinks',
	});

	const handleAppendVideo = () => {
		if (videoFields > 8) return;
		videoAppend({ videoLink: '' });
	};

	const handleRemoveVideo = (index) => {
		videoRemove(index);
	};

	return (
		<div>
			<div className="flex flex-col gap-3">
				<button className="button font-[600]" type="button" onClick={() => handleAppendVideo()}>
					Dodaj video link
				</button>
				{videoFields.map((item, i) => (
					<div className="flex items-center gap-3 relative mb-5" key={i}>
						<input
							className="clinic-input w-full"
							type="text"
							placeholder="Video Link..."
							{...register(`videoLinks.${i}.videoLink`, {
								required: true,
								pattern: {
									message: 'Only youtube embed links are allowed',
									value: /^(https?\:\/\/)?(www\.youtube\.com\/embed)\/.+$/,
								},
							})}
						/>
						{errors.videoLinks?.[i]?.videoLink?.type === 'pattern' && (
							<div className="flex items-center gap-1 absolute bottom-[-30px]">
								<span className="text-primaryColor font-[500]">{errors.videoLinks?.[i]?.videoLink?.message}</span>
							</div>
						)}
						<div
							className="bg-primaryColor rounded-[8px] min-h-[53px] min-w-[54px] flex justify-center items-center cursor-pointer"
							onClick={() => handleRemoveVideo(i)}
						>
							<AiFillDelete color="white" size={25} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default PhoneNumbers;
