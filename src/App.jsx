import { useState } from 'react';
import './App.scss';

const backendUrl = 'http://localhost:5889';

function App() {
	const [uploadFile, setUploadFile] = useState({ preview: '', data: '' });
	const [status, setStatus] = useState('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		let formData = new FormData();
		formData.append('file', uploadFile.data);
		const response = await fetch(`${backendUrl}/uploadfile`, {
			method: 'POST',
			body: formData
		});
		if (response) setStatus(response.statusText);
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

	return (
		<div className="App">
			<h1>File Uploader</h1>
			<hr />
			<form onSubmit={handleSubmit}>

				<input type="file" onChange={handleFileChange}></input>
				<button type="submit">Upload Now</button>
			</form>
			<hr />
			{status !== 'OK' && uploadFile.preview && (
				<>
					<div className="uploadMessage">
						FILE TO UPLOAD:{' '}
						<span className="uploadFileName">
							{uploadFile.name}
						</span>
					</div>
					{uploadFile.name.endsWith('.jpg') && (
						<img
							src={uploadFile.preview}
							width="100"
							height="100"
						/>
					)}
				</>
			)}
			{status === 'OK' && <h4>File was uploaded.</h4>}
		</div>
	);
}

export default App;