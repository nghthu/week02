import { useEffect, useState } from "react";
import styles from "./App.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const getImageUrl =
    "https://api.unsplash.com/photos/?client_id=v0Enjgp2wl9c8miQKumCIrwQwA969sMds9oCTDL7pn8";

  const searchImageUrl =
    "https://api.unsplash.com/search/photos/?client_id=v0Enjgp2wl9c8miQKumCIrwQwA969sMds9oCTDL7pn8";

  const handleSearch = async (method = "get") => {
    try {
      let url;
      if (method === "get") url = `${getImageUrl}&per_page=20&page=${page}`;
      else if (method === "search") {
        url = `${searchImageUrl}&per_page=20&page=${page}&query=${searchText}`;
        setIsLoading(true);
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (method === "get")
          setSearchResults((prevData) => [...prevData, ...data]);
        else setSearchResults(data.results);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  const changeTextHandler = (event) => {
    setSearchText(event.target.value);
  };

  const keyPressHandler = (event) => {
    if (event.key === "Enter") {
      setSearchText("");
      handleSearch("search");
    }
  };

  const loading = <h4 className={styles.loading}>Loading ...</h4>;

  return (
    <div className={styles.container}>
      <h2>Image Searching Website</h2>

      <div className={styles["search-box"]}>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchText}
          onChange={changeTextHandler}
          onKeyDown={keyPressHandler}
        />
      </div>

      <InfiniteScroll
        dataLength={searchResults.length}
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={loading}
      >
        {searchResults && !isLoading && (
          <div className={styles.results}>
            {searchResults.map((image, index) => (
              <div key={index} className={styles.image}>
                <img src={image.urls.thumb} alt={image.alt_description} />
              </div>
            ))}
          </div>
        )}

        {isLoading && <h4 className={styles.loading}>Loading ...</h4>}

        {!searchResults.length && !isLoading && (
          <h4 className={styles.loading}>No Results Found</h4>
        )}
      </InfiniteScroll>
    </div>
  );
}

export default App;
