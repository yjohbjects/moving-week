<template>
<!-- 리뷰 작성 페이지 -->
<div id="create-review" :style="`background: rgba(0, 0, 0, 0.75); background-image: url(${ movieDetail?.poster_path }); background-size: cover; background-blend-mode: darken; background-repeat : no-repeat; width: 100%; height: 180vh`">
    <h1>⠀</h1>
    <div class="container my-5">
  <div class="card" style="background-color: rgba(255, 255, 255, 0.2); border-radius: 10px">

      <form @submit.prevent="createReview">
        <!-- <div class="container"> -->
        <h1 style="text-align: center" class="mt-4">리뷰</h1><br>

        <div class="card-body">

        <label for="title">제목</label><br>
        <input type="text" class="form-control" id="title" placeholder="제목을 입력해주세요." v-model="title"><br>

        <label for="content">내용</label>
        <textarea id="content" class="form-control" v-model="content" placeholder="내용을 입력해주세요."></textarea>

        <div class="d-flex justify-content-end my-4">
        <input class="btn" style="background-color: #5CB8E4; color: #F2F2F2;" type="submit" value="등록하기"><br>
        </div>
        <!-- </div>  -->
        </div>
      </form>

    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  
  name: 'CreateReview',
  data() {
    return {
      movieId: this.$route.params.movieId,
      title: null,
      content: null,
      movieDetail: null,
    }
  },
  methods: {
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
      })
      .catch((error) => {
        console.log(error)
      })
    },
    createReview() {
      const title = this.title
      const content = this.content
      const movieId = this.movieId
      const user = this.$store.state.user
      const payload = {
        title: title,
        content: content,
        movieId: movieId,
        user: user,
      }

      this.$store.dispatch('createReview', payload)
      console.log(this.movieId)
      this.$router.push({ name: "Detail", params: { movieId: this.movieId } })
    }
  },
  created() {
    this.getMovieDetail()

    // console.log(this.movieId)
  }
}
</script>

<style>
</style>
