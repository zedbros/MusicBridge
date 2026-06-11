import { useState, useEffect } from 'react'
import './App.css'

import React from 'react'
import { Route, Routes, useParams, Navigate, Link } from "react-router-dom"

import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_USER = gql`
  query GetUser($nickname: String!) {
    getUser(nickname: $nickname) {
      nickname
    }
  }
`;
const GET_USER_PROFILE = gql`
  query GetUser($nickname: String!) {
    getUser(nickname: $nickname) {
      nickname
      bio
      genre
      profile_picture_id
    }
  }
`;
const UPDATE_PROFILE = gql`
  mutation UpdateProfile($bio: String, $genre: String, $profile_picture_id: String) {
    updateProfile(bio: $bio, genre: $genre, profile_picture_id: $profile_picture_id) {
      nickname
      bio
      genre
      profile_picture_id
    }
  }
`;
const GET_ALL_USERS = gql`
  query {
    getAllUsers { nickname }
  }
`;

const GET_USER_PLAYLISTS = gql`
  query GetUserPlaylists($nickname: String!) {
    getUserPlaylists(nickname: $nickname) {
      id
      name
      viewability
      profile_picture_id
    }
  }
`;

const GET_PLAYLIST_EDIT = gql`
  query GetPlaylist($id: ID!) {
    getPlaylist(id: $id) {
      id name viewability
    }
  }
`;

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist($name: String!, $viewability: String!) {
    createPlaylist(name: $name, viewability: $viewability) {
      id
      name
    }
  }
`;
const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($id: ID!, $name: String, $viewability: String, $profile_picture_id: String) {
    updatePlaylist(id: $id, name: $name, viewability: $viewability, profile_picture_id: $profile_picture_id) {
      id
      name
      viewability
      profile_picture_id
    }
  }
`;

const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id)
  }
`;

const SEARCH_SONG = gql`
  query SearchSong($query: String!) {
    searchSong(query: $query) {
      available
      song {
        name artist album duration cover spotifyId
      }
    }
  }
`;

const ADD_SONG = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $song: SongInput!) {
    addSongToPlaylist(playlistId: $playlistId, song: $song) {
      id songs { name artist cover spotifyId }
    }
  }
`;

const REMOVE_SONG = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $spotifyId: String!) {
    removeSongFromPlaylist(playlistId: $playlistId, spotifyId: $spotifyId) {
      id songs { name artist cover spotifyId }
    }
  }
`;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/user/:nickname/home" element={<UserHome />} />
      <Route path="/user/:nickname/edit" element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />
      <Route path="/four" element={<Four />} />

      {/* <Route path="/user/:nickname/playlists" element={<UserPlaylists />} /> */}
      <Route path="/user/:nickname/playlists/new" element={<ProtectedRoute><PlaylistNew /></ProtectedRoute>} />
      <Route path="/user/:nickname/playlists/:id" element={<PlaylistView />} />
      <Route path="/user/:nickname/playlists/:id/edit" element={<ProtectedRoute><PlaylistEdit /></ProtectedRoute>} />
    </Routes>
  )
}

function Welcome() {
  return (
    <>
      <h1 style={{ fontSize: "xx-large", color: "purple" }}>Welcome to</h1>
      <h1>Music Bridge</h1>
      <div className="icon">
        <a>
          <img className="logo" onClick={event => window.location.href='/home'} src="src/res/musicBridgeIdeaIcon.jpg"/>
        </a><br></br>
        yippee<p></p>
        We make a musik.<br></br>
      </div>
      <div className="cred_table">        
        <button onClick={event => window.location.href='/signUp'}>Sign Up</button>
        <button onClick={event => window.location.href='/login' }>Log In</button>
      </div>
    </>
  )
}

function SignUp(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    else if (email.length > 40) newErrors.email = "Email is too long (>30)"

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';

    if (!nickname) newErrors.nickname = 'Nickname is required';
    else if (nickname.length > 20) newErrors.nickname = "Nickname is too long (>20)"

    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    } 
    try {
      const res = await fetch("/api/auth/signUp/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nickname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error });
      } else {
        // localStorage.setItem("token", data.token);
        localStorage.setItem("nickname", data.nickname);

        window.location.href = `/user/${nickname}/home` // where it redirects you to
        // window.location.href = `/` // where it redirects you to
      }
    }
    catch (e) {
      setErrors({ server: "Could not reach the server."});
    }
  };

  return (
    <>
    <div className='sign-wrapper'>
      <div className='sign-form-container'>
        <h2 className="sign-title">Sign up</h2>
        <Form onSubmit={handleSubmit} className="sign-form">


          <Form.Group className="sign-box" controlId="formBasicNickname">
            <Form.Control.Feedback type="invalid">
              {errors.nickname}
            </Form.Control.Feedback>
            <Form.Label >Nickname</Form.Label>
            <Form.Control className='sign-text-box'
              type="string"
              placeholder="enter unique"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              isInvalid={!!errors.nickname}
            />
          </Form.Group>


          <Form.Group className="sign-box" controlId="formBasicEmail">
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Label>Email address</Form.Label>
            <Form.Control className='sign-text-box'
              type="email"
              placeholder="enter valid email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
          </Form.Group>

          <Form.Group className="sign-box" controlId="formBasicPassword">
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
            <Form.Label >Password</Form.Label>
            <Form.Control className='sign-text-box'
              type="password"
              placeholder="min length 3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
          </Form.Group>


          {errors.server && <Alert variant="danger">{errors.server}</Alert>} {/* shows error if nickname or email already exists in the DB. */}
          <Button variant="primary" type="submit" className="sign-button">
            Sell your soul
          </Button>
        </Form>
      </div>
    </div>
    <button onClick={event => window.location.href='/'}>Go back</button>
    </>
  );
}

function Login(){
  const [nick_email, setNickEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!nick_email) newErrors.nick_email = 'Email or Nickname is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';
    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nick_email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error });
      } else {
        // localStorage.setItem("token", data.token);
        localStorage.setItem("nickname", data.nickname);

        window.location.href = `/user/${data.nickname}/home` // where it redirects you to
      }
    }
    catch (e) {
      setErrors({ server: "Could not reach the server."});
    }
  };

  return (
    <>
    <div className='login-wrapper'>
      <div className='login-form-container'>
        <h2 className="login-title">Login</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="login-box" controlId="formBasicEmail">
            <Form.Label>Email or nickname</Form.Label>
            <Form.Control className='login-text-box'
              type="string"
              placeholder="Enter Email or nickname"
              value={nick_email}
              onChange={(e) => setNickEmail(e.target.value)}
              isInvalid={!!errors.nick_email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nick_email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="login-box" controlId="formBasicPassword">
            <Form.Label >Password</Form.Label>
            <Form.Control className='login-text-box'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.server && <Alert variant="danger">{errors.server}</Alert>} {/* shows error if nickname or email already exists in the DB. */}
          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>
        </Form>
      </div>
    </div>
    <button onClick={event => window.location.href='/'}>Go back</button>
    </>
  );
}

function Home() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <>
      <h1 style={{ fontSize: "xx-large", color: "purple" }}>Homepage</h1>
      <h1>Music Bridge</h1>
      <img className="logo" onClick={event => window.location.href='/'} src="src/res/musicBridgeIdeaIcon.jpg"/>
      <div className="home-users">
        {data.getAllUsers.map(user => (
          <div className="home-user-box" key={user.nickname}
            onClick={() => window.location.href = `/user/${user.nickname}/home`}
          >
          {user.nickname}
          </div>
        ))}
      </div>
    </>
  )
}

function UserHome() {
  const { nickname } = useParams();
  const isOwner = localStorage.getItem("nickname") === nickname

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { nickname },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile: </p>;

  return (
    <>
    <header>
      <a>
        <img className="logo" onClick={event => window.location.href='/home'} src="/src/res/musicBridgeIdeaIcon.jpg"/>
      </a><br></br>
    </header>
    <div>
      <h2 className='h2-user-welcome'>Welcome to <span className="user-welcome-nickname">{data.getUser.nickname}'s</span> page</h2>
      {/* <img src="/src/res/smol_2B.png" width={100}/> */}
      {data.getUser.profile_picture_id && (
        <img
          src={`/api/images/${data.getUser.profile_picture_id}`}
          width={100} height={100}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      )}
      <p>Bio | {data.getUser.bio}</p>
      <p>Favourite genres | {data.getUser.genre}</p>
      {isOwner && (
        <>
        <button onClick={() => window.location.href = `/user/${nickname}/edit`}>
          Edit page
        </button>
        <button onClick={handleLogout}>Log out</button>
        </>
      )}
      <hr />
      <h2>Playlists</h2>
      <UserPlaylistList nickname={nickname} />
    </div>
    </>
  );
}

function UserEdit() {
  const { nickname } = useParams();
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery(GET_USER_PROFILE, { variables: { nickname }});
  useEffect(() => {
    if (data?.getUser) {
      setBio(data.getUser.bio || "");
      setGenre(data.getUser.genre || "");
    }
  }, [data]);

  const [updateProfile, { error }] = useMutation(UPDATE_PROFILE, {
    update(cache, { data: { updateProfile } }) {
      cache.writeQuery({
        query: GET_USER_PROFILE,
        variables: { nickname },
        data: { getUser: updateProfile },
      });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let profile_picture_id = undefined;

      // Upload image first if one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch("/api/images/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        profile_picture_id = data.id;
      }

      await updateProfile({ variables: { bio, genre, profile_picture_id } });
      window.location.href = `/user/${nickname}/home`;
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1>Edit your page, {nickname}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)}/>
        </div>
        <div>
          <label>Favourite genre</label>
          <textarea value={genre} onChange={e => setGenre(e.target.value)} />
        </div>
        <div>
          <label>Profile picture</label>
          <input type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files[0])} />
        </div>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <button type="submit" disabled={saving}>Save</button>
      </form>
      <button onClick={() => window.location.href = `/user/${nickname}/home`}>Cancel</button>

      <hr />
      <h2>Your playlists</h2>
      <button onClick={() => window.location.href = `/user/${nickname}/playlists/new`}>
        + New playlist
      </button>
      <UserPlaylistList nickname={nickname} />
    </>
  );
}

// function UserPlaylists() {
//   const { nickname } = useParams();
//   const isOwner = localStorage.getItem("nickname") === nickname;
//   const { loading, error, data } = useQuery(GET_USER_PLAYLISTS, {
//     variables: { nickname },
//   });

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error loading playlists.</p>;

//   return (
//     <>
//       <img className="logo" onClick={event => window.location.href='/home'} src="/src/res/musicBridgeIdeaIcon.jpg"/>
//       <h1>{nickname}'s playlists</h1>
//       <button onClick={() => window.location.href = `/user/${nickname}/home`}>Back</button>
//       {isOwner && (
//         <button onClick={() => window.location.href = `/user/${nickname}/playlists/new`}>
//           + New playlist
//         </button>
//       )}
//       <UserPlaylistList nickname={nickname} />
//     </>
//   );
// }


function UserPlaylistList({ nickname }) {
  // TODO WHEN CLICK ON DELTE EVEN IF WE CANCEL OR ACTUALLY DELETE IT, PREVENT IT FROM GOING TO THE PLAYLIST PAGE..
  // JUST STAY HOME
  // TODO MAKE THEM ACTUALLY NOT APPEAR ON PUBLIC IF PRIVATE.. ONLY OWNER CAN SEE IT.
  const isOwner = localStorage.getItem("nickname") === nickname
  const { loading, error, data } = useQuery(GET_USER_PLAYLISTS, {
    variables: { nickname },
  });
  const [deletePlaylist] = useMutation(DELETE_PLAYLIST, {
    refetchQueries: [{ query: GET_USER_PLAYLISTS, variables: { nickname } }],
  });

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>Error loading playlists.</p>;

  // Only show private playlists to the owner
  const visiblePlaylists = isOwner
    ? data.getUserPlaylists
    : data.getUserPlaylists.filter(pl => pl.viewability === "public");

  return (
    <>
    <div>
      {visiblePlaylists.map(pl => (
        <div className="home-playlist-box" key={pl.id} onClick={() => window.location.href=`/user/${nickname}/playlists/${pl.id}`}>
          {pl.profile_picture_id && (
            <img src={`/api/images/${pl.profile_picture_id}`} width={40} height={40}
              style={{ objectFit: "cover", borderRadius: "4px" }} />
          )}
          <span>
            {pl.name}
          </span>
          {isOwner && (
            <button onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${pl.name}"?`)){
                await deletePlaylist({ variables: { id: pl.id } });
              }
            }}
            style={{height: "40px"}}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
    </>
  );
}

function PlaylistNew() {
  const { nickname } = useParams();
  const [name, setName] = useState("");
  const [viewability, setViewability] = useState("public");

  const [createPlaylist, { loading, error }] = useMutation(CREATE_PLAYLIST, {
    refetchQueries: [{ query: GET_USER_PLAYLISTS, variables: { nickname } }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createPlaylist({ variables: { name, viewability } });
    window.location.href = `/user/${nickname}/playlists/${data.createPlaylist.id}/`;
  };

  return (
    <>
      <h1>New playlist</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Visibility</label>
          <select value={viewability} onChange={e => setViewability(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <button type="submit" disabled={loading}>Create</button><br></br>
      </form>
      <button onClick={() => window.location.href = `/user/${nickname}/home`}>Cancel</button>
    </>
  );
}

function PlaylistEdit() {
  const { nickname, id } = useParams();
  const [name, setName] = useState("");
  const [viewability, setViewability] = useState("public");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery(GET_PLAYLIST_EDIT, { variables: { id } });

  // Pre-fill once data arrives
  useEffect(() => {
    if (data?.getPlaylist) {
      setName(data.getPlaylist.name || "");
      setViewability(data.getPlaylist.viewability || "public");
    }
  }, [data]);

  const [updatePlaylist, { error }] = useMutation(UPDATE_PLAYLIST, {
    refetchQueries: [{ query: GET_USER_PLAYLISTS, variables: { nickname } }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let profile_picture_id = undefined;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch("/api/images/upload", {
          method: "POST",
          // headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        profile_picture_id = data.id;
      }
      await updatePlaylist({ variables: { id, name, viewability, profile_picture_id } });
      window.location.href = `/user/${nickname}/playlists/${id}`;
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1>Edit playlist</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Visibility</label>
          <select value={viewability} onChange={e => setViewability(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label>Playlist picture</label>
          <input type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files[0])} />
        </div>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <button type="submit" disabled={saving}>Save</button>
      </form>
      <button onClick={() => window.location.href = `/user/${nickname}/home`}>Cancel</button>
      <SongSearch playlistId={id} nickname={nickname}/>
    </>
  );
}

function PlaylistView() {
  const { nickname, id } = useParams();
  const isOwner = localStorage.getItem("nickname") === nickname;

  const [removeSong] = useMutation(REMOVE_SONG, {
    refetchQueries: [
      { query: gql`query GetPlaylist($id: ID!) { getPlaylist(id: $id) { id songs { name artist album duration cover spotifyId } } }`, variables: { id } }
    ],
  });

  const { loading, error, data } = useQuery(
    gql`query GetPlaylist($id: ID!) { 
      getPlaylist(id: $id) { 
        id name viewability profile_picture_id 
        songs { name artist album duration cover spotifyId }
      } 
    }`,
    { variables: { id } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading playlist.</p>;

  // const edit_or_home_dir = isOwner ? "edit" : "home";

  const pl = data.getPlaylist;

  return (
    <>
      <h1>{pl.name}</h1>
      {pl.profile_picture_id && (
        <img 
        src={`/api/images/${pl.profile_picture_id}`}
          
          // width={300} height={300}
          style={{ objectFit: "contain", maxWidth: "50%" }}
        />
       )} 
      {/* <p>Status: {pl.viewability}</p> */}
      <br></br>
      <button onClick={() => window.location.href = `/user/${nickname}/home`}>Back</button>
      <br></br>
      {isOwner && (
        <button onClick={() => window.location.href = `/user/${nickname}/playlists/${id}/edit`}>
          Edit playlist
        </button>
      )}
      <div>
        {pl.songs?.length === 0 && <p>No songs yet.</p>}
        {pl.songs?.map(song => (
          <div key={song.spotifyId} style={{ display: "flex", gap: "12px", alignItems: "center" }} onClick={(e) => window.open(`https://open.spotify.com/track/${song.spotifyId}`, "_blank")}>
            <img src={song.cover} width={50} height={50} />
            <div>
              <strong>{song.name} by {song.artist}</strong>
            </div>
            {isOwner && (
              <button onClick={(e) => {e.stopPropagation(); removeSong({ variables: { playlistId: id, spotifyId: song.spotifyId } })}}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function SongSearch({ playlistId, nickname }) {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(null);

  const { loading, data } = useQuery(SEARCH_SONG, {
    variables: { query: searchQuery },
    skip: !searchQuery,         // don't run until user submits
  });

  const [addSong] = useMutation(ADD_SONG, {
    refetchQueries: [{ query: GET_USER_PLAYLISTS, variables: { nickname } }],
  });

  const result = data?.searchSong;

  return (
    <div>
      <h3>Add a song</h3>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a song..."
      />
      <button onClick={() => setSearchQuery(query)} disabled={!query}>
        Search
      </button>

      {loading && <p>Searching...</p>}

      {result && !result.available && (
        <p>This song is not available on Spotify.</p>
      )}

      {result?.available && result.song && (
        <>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={result.song.cover} width={50} height={50} />
          <div>
            <strong>{result.song.name}</strong>
            <p>{result.song.artist} — {result.song.album}</p>
          </div>
          <button onClick={() => {
            const { __typename, ...songData } = result.song;
            addSong({ variables: { playlistId, song: songData } });
          }}>
            + Add
          </button>
        </div>
          <button onClick={() => window.location.href = `/user/${nickname}/playlists/${playlistId}`}>Back</button>
          </>
      )}
    </div>
  );
}

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  localStorage.removeItem("nickname");
  window.location.href = "/Login";
}

function ProtectedRoute({ children }) {
  const { nickname } = useParams();
  const storedNickname = localStorage.getItem("nickname");
  // const token = localStorage.getItem("token");

  if (!storedNickname || storedNickname !== nickname){
    return <Navigate to="/four"replace />;
  }
  return children;
}

function Four() {
  return (
    <>
      <h1>ACCESS DENIED</h1>
      <img className="logo" onClick={event => window.location.href='/'} src="src/res/musicBridgeIdeaIcon.jpg"/>
    </>
  )
}

export default App
