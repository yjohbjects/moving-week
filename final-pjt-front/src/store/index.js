import router from '@/router'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import _ from 'lodash'

Vue.use(Vuex)

const API_URL = 'http://127.0.0.1:8000'
const API_NOW_PLAYING_MOVIE_URL = 'https://api.themoviedb.org/3/movie/now_playing'
const API_POPULAR_MOVIE_URL = 'https://api.themoviedb.org/3/movie/popular'
const API_KEY = process.env.VUE_APP_TMDB_API_KEY


export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    recommendedMovies: [],
    popularMovies: [],
    nowPlayingMovies: [],
    isMypage: true,
    isLoginpage: true,
    token: null,
    user: null,
    username: null,
    nickname: null,
    reviews: [
      {
        id: 1,
        title: '저의 인생영화',
        content: '제 인생은 이 영화를 보기 전과 후로 나뉩니다',
        createdAt: new Date().getTime(),
      },
      {
        id: 2,
        title: '지루했습니다..;',
        content: '어두운 조명에 ASMR 켜놓고 낮잠 자고싶으신 분들께 추천합니다.',
        createdAt: new Date().getTime(),
      },
    ],
    // review_id: 3,
  },
  getters: {
    isLogin(state) {
      return state.token ? true : false
    },
    numWatchedMovies(state) {
      // watched movies로 변경되어야함
      return state.recommendedMovies.length
    },
    numToWatchMovies(state) {
      // to watch movies로 변경되어야함
      return state.recommendedMovies.length
    }
  },
  mutations: {
    GET_MOVIES(state, movies) {
      state.recommendedMovies = movies
    },

    GET_POPULAR_MOVIES(state, popularMovies) {
      state.popularMovies = popularMovies
    },

    GET_NOW_PLAYING_MOVIES(state, nowPlayingMovies) {
      state.nowPlayingMovies = nowPlayingMovies
    },

    NOW_HOME(state) {
      state.isMypage = false    
      state.isLoginpage = false
    },

    NOW_MYPAGE(state) {
      state.isMypage = true
      state.isLoginpage = false
    },

    NOW_LOGIN(state) {
      state.isMypage = false
      state.isLoginpage = true
    },

    SAVE_TOKEN(state, token) {
      state.token = token
      router.push({ name : 'Home' })
    },

    GET_USERNAME(state, payload) {
      state.username = payload["username"]
      state.nickname = payload["nickname"]
      state.user = payload["pk"]
    },

    LOGOUT(state) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      state.token = null
      state.username = null
    },
    CREATE_REVIEW(state, review) {
      state.reviews.push(review)
      state.review_id = state.review_id + 1
    },
    DELETE_REVIEW(state, review_id) {
      state.reviews = state.reviews.filter((review) => {
        return !(review.id === review_id)
      })
    },

  },
  actions: {
    getMovies(context) {
      axios({
        method: 'get',
        url: `${API_URL}/api/v1/movies/`,
        headers: {
          Authorization: `Token ${ context.state.token }`
        }
      })
        .then((response) => {
          context.commit('GET_MOVIES', response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getPopularMovies(context) {
      const params = {
        api_key: API_KEY, 
        language: 'ko-KR',
        page: _.sample(_.range(1, 40)),
        adult:false
      }

      axios({
        method: 'get',
        url: API_POPULAR_MOVIE_URL,
        params: params,
      })
      .then((response) => {
        context.commit('GET_POPULAR_MOVIES', response.data.results)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getNowPlayingMovies(context) {
      const params = {
        api_key: API_KEY, 
        language: 'ko-KR',
        page: _.sample(_.range(1, 40)),
        adult:false
      }

      axios({
        method: 'get',
        url: API_NOW_PLAYING_MOVIE_URL,
        params: params,
      })
      .then((response) => {
        context.commit('GET_NOW_PLAYING_MOVIES', response.data.results)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    nowHome(context) {
      context.commit('NOW_HOME')
    },

    nowMypage(context) {
      context.commit('NOW_MYPAGE')
    },

    nowLogin(context) {
      context.commit('NOW_LOGIN')
    },

    signUp(context, payload) {
      axios({
        method: 'post',
        url: `${API_URL}/accounts/signup/`,
        data: {
          username: payload.username,
          password1: payload.password1,
          password2: payload.password2,
        }
      })
        .then((response) => {
          context.commit('SAVE_TOKEN', response.data.key)
        })
    },

    logIn(context, payload) {
      axios({
        method: 'post',
        url: `${API_URL}/accounts/login/`,
        data: {
          username: payload.username,
          password: payload.password,
        }
      })
        .then((response) => {
          context.commit('SAVE_TOKEN', response.data.key)
        })
    },

    getUsername(context) {
      axios({
        method: 'get',
        url: `${API_URL}/accounts/user/`,
        headers: {
          Authorization : `Token ${ context.state.token }`
        }
      })
      .then((response) => {
        context.commit('GET_USERNAME', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    createReview(context, payload) {
      axios({
        method: 'post',
        url: `${API_URL}/api/v1/createreview/${payload.movieId}/`,
        data: {
          title: payload.title,
          content: payload.content,
          review_user: payload.user,
        },
        headers: {
          Authorization: `Token ${ context.state.token }`
        }
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getReviews(context) {
      axios({
        method: 'get',
        url: `${API_URL}/api/v1/review_list/`,
        headers: {
          Authorization: `Token ${ context.state.token }`
        }
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    },
  },
  modules: {
  }
})
