<template>
<!-- 지정된 영화 1편에 대한 디테일 페이지 -->

<div id="detail" :style="`background: rgba(0, 0, 0, 0.75); background-image: url(${ movieDetail?.poster_path }); background-size: cover; background-blend-mode: darken; background-repeat : no-repeat; width: 100%; height: 180vh`">
  <h1>⠀</h1>
  <div class="container my-5" >
  <div class="d-flex justify-content-between">
    <img :src="`${ movieDetail?.poster_path }`" width="30%" height="30%" style="border-radius: 5px">
    
    <div class="row container">
        <div>
          <span class="d-flex justify-content-between align-items-center">
            <div class="d-flex justify-content-start">
            <span style="font-weight: bold; font-size: 50px">{{ movieDetail?.title }} </span>
            <span style="font-size: 50px;">({{ release_year }})</span>
            </div>
            <ion-icon name="bookmark" size="large" v-if="isWished" @click="toWatch"></ion-icon> 
            <ion-icon name="bookmark-outline" size="large" v-else @click="toWatch"></ion-icon>
          </span>
          <p class="lead">{{ movieDetail?.original_title }}</p>
        </div>

      <!-- 관람가 -->
      <div class="">
        <!-- age limit image -->
        <span v-if="movieDetail?.certification==='PG-13'" class="mx-2"><img src="../../src/assets/12.png" alt="12" width="29" height="29"></span>
        <span v-if="movieDetail?.certification==='PG'" class="mx-2"><img src="../../src/assets/12.png" alt="12" width="29" height="29"></span>
        <span v-else-if="movieDetail?.certification==='G'" class="mx-2"><img src="../../src/assets/all.png" alt="ALL" width="29" height="29"></span>
        <span v-else-if="movieDetail?.certification==='R'" class="mx-2"><img src="../../src/assets/18.png" alt="15" width="29" height="29"></span>
        <span v-else-if="movieDetail?.certification==='NC-17'" class="mx-2"><img src="../../src/assets/18.png" alt="18" width="29" height="29"></span>
        <span v-else-if="movieDetail?.certification==='NR'" class="genres mx-2">NR</span>
        <span v-else-if="!movieDetail?.certification" class="genres mx-2">NR</span>
        
        <span class="genres m-2">
          <span style="color: #FABD02">★</span>
           {{ movieDetail?.vote_average/2 }}</span>
        <span class="genres mx-2">{{ genres.join(', ') }}</span>
      </div>

      <!-- 별점 -->
      <div class="my-3">
        <!-- <h5>user's rate</h5> -->
      <div
      @mouseover="hover = true"
      @mouseleave="hover = false"
      >
      <!-- hover하면 조정할 수 있는 별점 -->
      <star-rating 
        v-if="hover"
        v-model="inputRate"
        @rating-selected ="setRating"
        :rating="5"
        :increment="0.5" 
        inactive-color="#808080"
        active-color="#FABD02"
        :star-size="50"
        class="mb-3"
        :show-rating="false"
        >
      </star-rating>   
        
      <!-- 보여지는 별점 -->
      <star-rating 
      v-else
      :rating="`${ $store.state.userRate }`" 
      :increment="0.5"
      inactive-color="#808080"
      active-color="#FABD02"
      :star-size="50"
      class="mb-3"
      :show-rating="false"  
      >
      </star-rating>
      </div>
        <div class="mb-4">
          <span><h5 style="font-weight: bold;">감독</h5></span>
          <span @click='toPersonDetailDirector' class="for-cursor">{{ director }}</span>
        </div>
        
        <div class="mb-4">
        <span><h5 style="font-weight: bold;">출연진</h5></span>
          <span v-for="(actor, id) in actors" :key="id">
            <span @click="toPersonDetailActor(id)" class="for-cursor">{{ actor }}</span>
          </span>
        </div>

        <div class="mb-4">
          <span><h5 style="font-weight: bold;">줄거리</h5></span>
          <p>{{ movieDetail?.overview }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
  <!-- Reviews 커뮤니티 구역 -->
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
    <h1>Reviews</h1>
    <!-- <button @click="toCreateReview" class="btn btn-outline-secondary">작성</button> -->
    <ion-icon @click="toCreateReview" size="large" name="add-outline"></ion-icon>
    </div>
    <hr>
    <ReviewDetailCard v-for="review in reviews" :key="review.id" :review="review"/>
  </div>

    
</div>
</template>

<script>
import StarRating from 'vue-star-rating'
import ReviewDetailCard from '@/components/ReviewDetailCard'
import axios from 'axios'

const API_KEY = process.env.VUE_APP_TMDB_API_KEY
// const API_URL_GET_DIRECTOR_NAME = `http://127.0.0.1:8000/api/v1/get_director_name/`

export default {
  name: 'DetailView',
  components: {
    ReviewDetailCard,
    StarRating,
  },
  data() {
    return {
      movieId: this.$route.params.movieId,
      directorId: null,
      movieDetail: null,

      director: null,
      genres: [],
      genreId: null,
      actors: {},
      actorId: null,

      // userRate: 0,
      hover: false,
    }
  },
  props: {
    // movie: Object,
  },
  computed: {
    release_year() {
      return this.movieDetail.release_date.substring(0, 4)
    },
    movieDetails() {
      return this.$store.state.movieDetails
    },
    reviews() {
      return this.$store.state.reviews
    },
    isWished() {
      return this.$store.state.isWished
    },
  },
  methods: {
    setRating(){
      const rate = this.inputRate  // 입력된 값
      const watched_user = this.$store.state.user
      const movieId = this.movieId
      const payload = {
        rate: rate,
        watched_user: watched_user,
        movieId: movieId
      }
      if (this.userRate === 0) {
        this.$store.dispatch('createRate', payload)
      } else {
        this.$store.dispatch('updateRate', payload)
      }
      this.userRate = this.$store.state.userRate
    },
    getMovieDetail() {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/v1/movies/${this.movieId}`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        }
      })
      .then((response) => {
        this.movieDetail = response.data
        this.directorId = response.data.director
        
        this.$store.dispatch('getReviews', this.movieId)
        
        // 감독 이름 받기
        this.getDirectorName(response.data.director)
        
        // 배우 이름 받기
        for (this.actorId of response.data.actors) {
          this.getActorName(this.actorId)
        }
        
        // 장르 이름 받기
        for (this.genreId of response.data.genres) {
          this.getGenreName(this.genreId)
        }
        
      })
      .catch((error) => {
        console.log(error)
        this.pushMovieDetail()
      })
    },
    pushMovieDetail(){
      axios({
        method: 'post',
        url: `http://127.0.0.1:8000/api/v1/new_movie/${this.movieId}/`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        },
        data: {
          key: API_KEY
        }
      })
      .then((response) => {
        console.log(response)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      })

    },
    getDirectorName(directorId) {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/v1/get_director_name/${directorId}`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        }
      })
      .then((response) => {
        this.director = response.data["name"]
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getGenreName(genreId) {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/v1/get_genre_name/${genreId}`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        }
      })
      .then((response) => {
        this.genres.push(response.data["name"])
      })
      .catch((error) => {
        console.log(error)
      })
    },
    getActorName(actorId) {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/v1/get_actor_name/${actorId}`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        }
      })
      .then((response) => {
        this.actors[actorId] = response.data["name"]
      })
      .catch((error) => {
        console.log(error)
      })
    },
    toCreateReview() {
      this.$router.push({ name: "CreateReview", params: { movieId: this.movieId } })
    },

    toWatch() {
      axios({
        method: 'post',
        url: `http://127.0.0.1:8000/api/v1/wish/${this.movieId}/`,
        headers: {
          Authorization : `Token ${ this.$store.state.token }`
        }
      })
        .then((response) => {
          console.log('repository')
          console.log(this.isWished)
          if (response.data["is_wished"] === true) {
            alert('나중에 볼 영화 목록에 추가했습니다.')
          } else {
            alert('나중에 볼 영화 목록에서 해제했습니다.')
          }
          this.$store.commit('GET_WISH', response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getIsWished() {
      axios({
      method: 'get',
      url: `http://127.0.0.1:8000/api/v1/is_wish/${this.movieId}`,
      headers: {
          Authorization : `Token ${ this.$store.state.token }`
      }
    })
      .then((response) => {
        console.log('check')
        console.log(response.data)
        this.$store.commit('GET_WISH', response.data)
      })
    },
    toPersonDetailDirector() {
      this.$router.push({ name: 'PersonDetail', params: { personId: this.movieDetail.director } })
    },
    toPersonDetailActor(actorId) {
      console.log(actorId)
      this.$router.push({ name: 'PersonDetail', params: { personId: actorId } })
    },
  },
  created() {
    this.getMovieDetail()

    const watched_user = this.$store.state.user
    const movieId = this.movieId
    const payload = {
      watched_user: watched_user,
      movieId: movieId
    } 
    this.$store.dispatch('getRate', payload)
    this.userRate = this.$store.state.userRate

    this.getIsWished()
  }
  }

</script>

<style>
.genres {
    border: 1px solid;
    text-align: center;
    padding: 5px 5px;
    border-radius: 5px;
    margin: 20px auto;
}
ion-icon {
  color:#5CB8E4;
  cursor: pointer
}


</style>
