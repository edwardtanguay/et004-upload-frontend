import { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios';

const backendUrl = 'http://localhost:5889';
const _initialFormFields = {
	title: '',
	description: '',
	notes: ''
};
const _initialUploadFile = {
	preview: '',
	data: '',
	name: ''
};

function App() {
	const [uploadFile, setUploadFile] = useState({ ..._initialUploadFile });
	const [formFields, setFormFields] = useState({ ..._initialFormFields });
	const [status, setStatus] = useState('');
	const [fileItems, setFileItems] = useState([]);

	useEffect(() => {
		(async () => {
			setFileItems((await axios.get(`${backendUrl}/fileitems`)).data);
		})();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let formData = new FormData();
		formData.append('file', uploadFile.data);
		const response = await fetch(`${backendUrl}/uploadfile`, {
			method: 'POST',
			body: formData
		});
		if (response) setStatus(response.statusText);
		document.getElementById('mainForm').reset();
		setFormFields({ ..._initialFormFields });
		setUploadFile({ ..._initialUploadFile });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setStatus('');
		const _uploadFile = {
			name: file.name,
			preview: URL.createObjectURL(file),
			data: e.target.files[0]
		};
		setUploadFile(_uploadFile);
	};

	const handleFormFieldChange = (e, fieldName) => {
		const value = e.target.value;
		formFields[fieldName] = value;
		setFormFields({ ...formFields });
	};

	return (
		<div className="App">
			<h1>File Uploader</h1>
			<main>
				<section>
					<form id="mainForm" onSubmit={handleSubmit}>
						<fieldset>
							<legend>Enter file info and choose file:</legend>

							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								autoFocus
								value={formFields.title}
								onChange={(e) =>
									handleFormFieldChange(e, 'title')
								}
							/>

							<label htmlFor="description">Description</label>
							<input
								type="text"
								id="description"
								value={formFields.description}
								onChange={(e) =>
									handleFormFieldChange(e, 'description')
								}
							/>

							<label htmlFor="notes">Notes</label>
							<input
								type="text"
								value={formFields.notes}
								onChange={(e) =>
									handleFormFieldChange(e, 'notes')
								}
							/>

							<label>File to upload</label>
							<input
								type="file"
								onChange={handleFileChange}
							></input>
							<div className="buttonArea">
								<div className="preview">
									{!uploadFile.name.endsWith('.jpg') && (
										<div className="previewFileName">
											{uploadFile.name}
										</div>
									)}
									{uploadFile.name.endsWith('.jpg') && (
										<img
											src={uploadFile.preview}
											width="100"
											height="100"
										/>
									)}
								</div>
								<div className="buttonWrapper">
									<button type="submit">Submit</button>
								</div>
							</div>
						</fieldset>
					</form>
				</section>
				<section className="fileItemsArea">
					<h2>File Items</h2>
					{fileItems.length === 0 && (
						<p>There are {fileItems.length} file items</p>
					)}
					{fileItems.map((fileItem, i) => {
						return (
							
							<div className="fileItem" key={i}>
								<img src={`${backendUrl}/images/test.jpg`}/>
								<div className="info">
									<div className="title">
										{fileItem.title}
									</div>
									<div className="description">
										{fileItem.description}
									</div>
									<div className="notes">
										{fileItem.notes}
									</div>
									<div className="fileName">
										{fileItem.fileName}
									</div>
								</div>
							</div>
						);
					})}
				</section>
			</main>
		</div>
	);
}

export default App;
