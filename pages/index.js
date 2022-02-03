import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import { SiGithub } from "react-icons/si";
import { FiMapPin } from "react-icons/fi";
import Title from "../src/components/Title";
// import Servers from "../src/components/Servers";
import UsernameData from "../src/components/UsernameData";
import handleDateFormat from "../src/utils/handleDateFormat";

const usernameStates = {
  DEFAULT: appConfig.formMemes.status.welcome,
  LOADING: appConfig.formMemes.status.typing,
  DONE: appConfig.formMemes.result,
  ERROR: appConfig.formMemes.status.notFound,
};

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("FelipeGaigher");
  const [userLocation, setUserLocation] = React.useState(`Vitória-ES, Brazil `); // setando a localização inicial do usuário vazia.
  const roteamento = useRouter();

  const [usernameRequestStatus, setUsernameRequestStatus] = React.useState(
      usernameStates.DEFAULT
    );
  const [showResults, setShowResults] = React.useState(false);
  // const [username, setUsername] = React.useState("");
  const [timer, setTimer] = React.useState("");
  const [userData, setUserData] = React.useState({
    followers: "",
    following: "",
    accountDate: "",
    starsReceived: "",
    repositories: "",
    commits: "",
    lastCommitDate: "",
  });

  const newPage = useRouter();

  function chooseUserMeme(userSituation) {
    if (!userSituation.userHasCommits) {
      setUsernameRequestStatus(usernameStates.DONE.noCommits) //caus
    } else if (userSituation.accountCreatedOverTenYears) {
      setUsernameRequestStatus(usernameStates.DONE.oldUser); //peas
    } else if (userSituation.lastCommitOverThreeMonths) {
      setUsernameRequestStatus(usernameStates.DONE.longTimeNoSee); //olar
    } else if (userSituation.hasOverAHundredFollowers) {
      setUsernameRequestStatus(usernameStates.DONE.popStar); //omariosouto
    } else setUsernameRequestStatus(usernameStates.DONE.normal);
    setShowResults(true);
  }

  function verifyData(tempData) {
    const userHasCommits = tempData.commits > 0
    const now = new Date();
    const lastCommit = new Date(tempData.lastCommitDate)
    const githubCreated = new Date(tempData.accountDate)
    const lastCommitOverThreeMonths = (now.getTime() - lastCommit.getTime()) > 7889400000;
    const accountCreatedOverTenYears = (now.getTime() - githubCreated.getTime()) > 315576000000;
    const hasOverAHundredFollowers = tempData.followers > 100;
    const userSituation = {
      userHasCommits,
      lastCommitOverThreeMonths,
      accountCreatedOverTenYears,
      hasOverAHundredFollowers
    }
    chooseUserMeme(userSituation);
  }

  function getCommitsData(tempStarsData, login) {
    fetch(`https://api.github.com/search/commits?q=author:${login}&sort=author-date`)
      .then(async res => await res.json())
      .then((data) => {
        const tempData = {
          ...tempStarsData,
          commits: data?.total_count,
          lastCommitDate: data?.items[0]?.commit.committer.date || null
        }
        setUserData(tempData);
        verifyData(tempData);
      })
  }

  function getStarsReceived(tempUserData, login) {
    fetch(`https://api.github.com/users/${login}/repos`)
      .then(async (res) => await res.json())
      .then((data) => {
        const totalStars = data.reduce((prev, curr) => {
          return curr.stargazers_count + prev
        }, 0)
        const tempStarsData = {
          ...tempUserData,
          starsReceived: totalStars
        }
        getCommitsData(tempStarsData, login)
      })
  }

  function handleUsernameData(data) {
    const tempUserData = {
      followers: data.followers,
      following: data.following,
      accountDate: data.created_at,
      repositories: data.public_repos,
    }
    getStarsReceived(tempUserData, data.login);
  }
  
  function checkIfUserExists(value) {
    fetch(`https://api.github.com/users/${value}`)
      .then(async (res) => {
        if(res.status === 404) {
          setUsernameRequestStatus(usernameStates.ERROR);
          return
        } else {
          return await res.json()
        }
      })
      .then((data) => {
        if (data) {
          handleUsernameData(data)
        }
      })
      .catch(error => {
        console.error('Não foi possível obter user. Erro: ', error)
      })
  } 
 
  function waitBeforeRequest(value) {
    const timeout = timer;
    timeout && clearTimeout(timeout);

    const newTimeout = setTimeout(async () => {
      checkIfUserExists(value);
    }, 1000);

    setTimer(newTimeout);
  }

  function handleInputChange(event) {
    const value = event.target.value;
    setUsername(value);

    if (value.length > 2) {
      setUsernameRequestStatus(usernameStates.LOADING);
      waitBeforeRequest(value);
    } else {
      setShowResults(false);
      setUsernameRequestStatus(usernameStates.DEFAULT);
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    localStorage.setItem('user', username)
    newPage.push("chat");
  }``

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/10/star-wars-millennium-falcon-hologame-table.jpeg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
          backgroundPosition: "bottom right",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            marginLeft: {
              xs: "16px",
              sm: "25vw",
            },
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: `${appConfig.theme.colors.neutrals[700]}CC`,
            transition: "margin-bottom 3s",
          }}
        >
          <Box
            styleSheet={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              marginBottom: "16px",
            }}
          >
            {/* Formulário */}
            <Box
              onSubmit={handleFormSubmit}
              as="form"
              styleSheet={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: {
                  xs: "100%",
                  sm: "50%",
                },
                textAlign: "center",
                marginBottom: "32px",
              }}
            >
              <Title tag="h2">Boas vindas!</Title>
              <Text
                variant="body3"
                styleSheet={{
                  marginBottom: "32px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
              >
                {appConfig.name}
              </Text>

              <TextField
                onChange={handleInputChange}
                fullWidth
                textFieldColors={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[200],
                    mainColor: appConfig.theme.colors.neutrals[900],
                    mainColorHighlight: appConfig.theme.colors.primary[500],
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                  },
                }}
              />
              <Button
                type="submit"
                label="Entrar"
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["050"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
                styleSheet={{
                  fontWeight: 600,
                }}
                disabled={!showResults}
              />
            </Box>
            {/* Formulário */}

            {/* Area do meme */}
            <Box
              styleSheet={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "300px",
                padding: "16px",
                marginLeft: {
                  xs: "0",
                  sm: "32px",
                },
                backgroundColor: appConfig.theme.colors.neutrals[800],
                border: "1px solid",
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: "10px",
                flex: 1,
                minHeight: "240px",
              }}
            >
              <Image
                styleSheet={{
                  borderRadius: "10px",
                  marginBottom: "16px",
                }}
                src={usernameRequestStatus.image}
                alt={usernameRequestStatus.alt}
              />
              <Text
                variant="body3"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  textAlign: "center",
                  // whiteSpace: "nowrap",
                }}
              >
                {usernameRequestStatus.message}
              </Text>
            </Box>
            {/* Area do meme */}
          </Box>

          {/* Area do resultado */}
            <Box
              styleSheet={{
                borderTop: "1px solid",
                borderTopColor: appConfig.theme.colors.neutrals[800],
                transition: "all 1s .1s",
                position: showResults ? 'static' : 'absolute',
                opacity: showResults ? '1' : '0',
                transform: showResults ? 'translateY(0)' : 'translateY(-100px)'
              }}
            >
              <Box
                styleSheet={{
                  position: showResults ? 'static' : 'absolute',
                  opacity: showResults ? '1' : '0',
                  paddingTop: "16px",
                  paddingBottom: "8px",
                }}
              >
                <Title tag="h3"> Dados do usuário </Title>
              </Box>
              <Box
                styleSheet={{
                  position: showResults ? 'static' : 'absolute',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                {/* Imagem do user */}
                <Box
                  styleSheet={{
                    position: showResults ? 'static' : 'absolute',
                    opacity: showResults ? '1' : '0',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "200px",
                    padding: "16px",
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                    border: "1px solid",
                    borderColor: appConfig.theme.colors.neutrals[999],
                    borderRadius: "10px",
                    flex: 1,
                    minHeight: "240px",
                  }}
                >
                  <Image
                    styleSheet={{
                      borderRadius: "50%",
                      marginBottom: "16px",
                    }}
                    src={`https://github.com/${username}.png`}
                  />
                  <Text
                    variant="body4"
                    styleSheet={{
                      color: appConfig.theme.colors.neutrals[200],
                      backgroundColor: appConfig.theme.colors.neutrals[900],
                      padding: "3px 10px",
                      borderRadius: "1000px",
                    }}
                  >
                    {username}
                  </Text>
                </Box>
                {/* Imagem do user */}

                <Box
                  styleSheet={{
                    position: showResults ? 'static' : 'absolute',
                    opacity: showResults ? '1' : '0',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "16px",
                    margin: "16px",
                    maxWidth: "400px",
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                    borderRadius: "4px",
                    flex: 1,
                  }}
                >
                  <UsernameData>Data de criação do Github: {userData.accountDate && handleDateFormat(userData.accountDate)}</UsernameData>
                  <UsernameData>Seguidores: {userData.followers}</UsernameData>
                  <UsernameData>Seguindo: {userData.following}</UsernameData>
                  <UsernameData>Estrelas recebidas: {userData.starsReceived}</UsernameData>
                  <UsernameData>Repositórios: {userData.repositories}</UsernameData>
                  <UsernameData>Commits: {userData.commits}</UsernameData>
                  <UsernameData>Data do último commit: {userData.lastCommitDate && handleDateFormat(userData.lastCommitDate)}</UsernameData>
                </Box>
              </Box>

              <Box
                styleSheet={{
                  position: showResults ? 'static' : 'absolute',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "16px",
                }}
              >
                <Image
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&langs_count=10&theme=panda`}
                />
              </Box>
            </Box>  
          {/* Dados do user */}
        </Box>
      </Box>
    </>
  );
}
