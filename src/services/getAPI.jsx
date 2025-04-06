export const baseURL = process.env.BASE_URL_DEVELOPMENT;

export function postToServer(url, bodyObject) {
	return new Promise((resolve, reject) =>
    fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject),
		})
			.then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				if (response.status === 200) {
						response.json().then(json => resolve(json));
				} else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err)),
	);
}