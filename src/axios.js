import axios from "axios";

//const token = localStorage.getItem('authToken')

//console.log(token)

const http = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',

    headers: {
        Accept: 'application/json',
        //Authorization: token ? `Bearer ${token}` : ''
    }
})

http.interceptors.request.use(
  (config) => {
    //definir para todas as requisições os parâmetros de accept e authorization
    const token = localStorage.getItem('authToken')
    //config.headers.Accept = "application/json";
    //console.log(token)
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // config.headers.['Accept'] = ''
    // config.headers.['Authorization'] = ''

    console.log("Interceptando o request antes do envio:", config);
    return config;

  },
  (error) => {
    console.log("Erro na requisição: ", error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use( //sucesso
  (response) => {
    console.log("response response:", response);
    return response;
  },
  (error) => {
    console.log("Interceptando a resposta antes da aplicação:", error);
    //refresh lógica
    if(error.response.status == 401 && error.response.data.message == 'Token has expired') {
      //axios.post('http://127.0.0.1:8000/api/refresh')
      http.post('http://127.0.0.1:8000/api/refresh')
        .then(response => {
          //console.log('refresh com sucesso: ', response)

          localStorage.setItem('authToken', response.data.tokenAtualizado)
          document.cookie = 'authToken=' + response.data.tokenAtualizado
          console.log('NOVO authToken: ', response.data.tokenAtualizado)
          //window.location.reload()
        })

    }
    return Promise.reject('promise reject: ' + error);
  }
);

export default http;
