import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import { SiGithub } from "react-icons/si";
import { FiMapPin } from "react-icons/fi";
import Title from "../src/components/Title";

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("FelipeGaigher");
  const [userLocation, setUserLocation] = React.useState(`Vitória-ES, Brazil `); // setando a localização inicial do usuário vazia.
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary["100"],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/10/star-wars-millennium-falcon-hologame-table.jpeg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "light",
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
            width: "100%",
            maxWidth: "600px",
            borderRadius: "40px", 
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 20px 0 rgb(0 0 0 / 100%)",
            backgroundColor: "rgba(0,0,0,0.3)",
            // backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infosDoEvento) {
              infosDoEvento.preventDefault(); // parar de ficar recarregando a página quando clicar no botão
              // roteamento.push("/chat");
              roteamento.push(`/chat?username=${username}`); //  usando o rout do next para fazer a paginação
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Seja bem vindo!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              required
              value={username}
              //função que captura o que o usuario digitou no campo de texto, e atualiza a variável username com a função setUsername
              onChange={function (event) {
                const valor = event.target.value;

                if (valor.length >= 0) {
                  // verifica se o valor digitado no campo do texto é maior que 2 para fazer a troca da variável username
                  setUsername(valor);
                  fetch(`https://api.github.com/users/${valor}`) //coleta os dados do github
                    .then((response) => response.json())
                    .then((data) => {
                      setUserLocation(data.location); // seta a variavel userLocation com a location do usuário
                    });
                } else {
                  setUsername("FelipeGaigher");
                  setUserLocation("Vitória-ES, Brazil");
                }
              }}
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
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[200],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: "rgba(0,0,0,0.1)",

              // backgroundColor: appConfig.theme.colors.neutrals[800],
              // border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "40px", 
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              // src={`https://github.com/${username}.png`}
              src={
                username.length > 2
                  ? `https://github.com/${username}.png`
                  : `https://github.com/null.png`
              }
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
              <SiGithub />
              &nbsp;{username}
            </Text>

            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              <FiMapPin />
              &nbsp;{userLocation}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
