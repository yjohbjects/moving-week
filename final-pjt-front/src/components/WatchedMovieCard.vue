<template>
  <div>
    <router-link :to="{ name: 'Detail', params: { movieId: movieId } }" style="color: #F2F2F2">
    <div class="container my-2">
      <div class="d-flex justify-content-between">
        <img :src="`${ poster_path }`" width="20%" height="20%" style="border-radius: 5px">

        <div class="row container d-flex align-items-start">
          <!-- <div class=""> -->
            <div>
              <!-- <span> -->
                <span style="font-weight: bold; font-size: 45px">{{ movie.movie["title"] }}</span>
                <span style="font-weight: bold; font-size: 35px">({{ movie.movie["release_date"].slice(0, 4) }})</span>
                <p class="mx-2 mb-3" style="font-weight: bold; font-size: 20px">{{ movie.movie["original_title"] }}</p>
                <span class="mx-2" style="
                  border: 1px solid;
                  text-align: center;
                  padding: 5px 5px;
                  border-radius: 5px;
                  margin: 20px auto;
                ">
                  <span style="color: #FABD02">★</span>
                  {{ movie.rate }}</span>
                
              <!-- </span> -->
            </div>
          <!-- </div>  -->
          
          <div class="mx-1">
            <span class="mx-1">{{ movie.movie["overview"] }}</span>
          </div>
        </div>
        </div>

      <hr>
    </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WatchedMovieCard',
  data() {
    return {
      poster_path: this.movie.movie["poster_path"],
      movieId: this.movie.movie["id"]
    }
  },
  props: {
    movie: Object,
  },
}
</script>

<style>

</style>