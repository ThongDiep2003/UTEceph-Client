import { useDispatch } from "react-redux";
import { cookies } from "../common/Utility.jsx";
import { logOutDoctor } from "../redux/DoctorSlice.jsx";

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

export function postToServerWithToken(url, bodyObject,dispatch) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
    fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject)
		})
			.then((response) => {
				if(response.status==403){
					if(response.isLogin===false){
						dispatch(logOutDoctor());
					}
				}
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				if (response.status === 200) {
						response.json().then(json => resolve(json));
				} else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err))
	  }
	)
}

export function putToServerWithToken(url, bodyObject) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
    fetch(baseURL + url, {
			method: 'put',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject)
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
			.catch((err) => reject(err))
	  }
	)
}

export function getToServerWithToken(url) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
    fetch(baseURL + url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin'
		})
			.then((response) => {
				if(response.status===403){
					response.json().then(json => reject(json))
				}
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				if (response.status === 200) {
						response.json().then(json => resolve(json));
				} else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err))
    }
	);
}

