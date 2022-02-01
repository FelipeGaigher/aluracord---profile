import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import ButtonSendSticker from "../components/ButtonSendSticker";
import loadingImg from "../components/loadingImg";
import { MdDeleteOutline } from "react-icons/md";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY3MjY5MCwiZXhwIjoxOTU5MjQ4NjkwfQ.qsnte9cqPtBrSapTQd1rQLFuXJ51wRpueJ1Ll8W_t_o";
const SUPABASE_URL = "https://tptpsqogzlfhtxvqfffa.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function mensagemTempoReal(addMensagem) {
  return supabaseClient
    .from("mensagem")
    .on("*", (response) => {
      addMensagem(response);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username; // pegando o usuario pela url

  //Usar dados do servidor
  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados da consulta: ", data);
        setListaDeMensagens(data);
      });

    mensagemTempoReal((novaMensagem) => {
      console.log("nova mensagem", novaMensagem);
      if (novaMensagem.eventType === "INSERT") {
        setListaDeMensagens((valorAtualDaLista) => {
          return setListaDeMensagens([novaMensagem.new, ...valorAtualDaLista]);
        });
      } else if (novaMensagem.eventType === "DELETE") {
        setListaDeMensagens((currentValue) => {
          let newListaMensagem = currentValue.filter((item) => {
            if (item.id != novaMensagem.old.id) {
              return item;
            }
          });
          setListaDeMensagens([...newListaMensagem]);
        });
      }
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: "FelipeGaigher",
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {
        console.log("criando mensagem: ", data);
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage:
          "url(https://virtualbackgrounds.site/wp-content/uploads/2020/12/amazon-rainforest.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "light",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "70%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          {listaDeMensagens < 1 ? (
            loadingImg()
          ) : (
            <MessageList
              mensagens={listaDeMensagens}
              setListaDeMensagens={setListaDeMensagens}
            />
          )}

          {/* <MessageList mensagens={listaDeMensagens} /> */}
          {/* <MessageList mensagens={listaDeMensagens} /> */}

          {/* {listaDeMensagens.map((mensagemAtual) => {
            console.log(mensagemAtual);
            return (
            <li key={mensagemAtual.id}>
              {mensagemAtual.de} : {mensagemAtual.texto}
            </li>);
          })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;

                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(":sticker:" + sticker);
              }}
            />

            <Button
              type="button"
              label="Enviar"
              onClick={(e) => {
                if (mensagem != "") {
                  e.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              styleSheet={{
                borderRadius: "5px",
                padding: "13px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                marginBottom: "7px",
                color: appConfig.theme.colors.neutrals[200],
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  //funcão que deleta as mensagem da tela
  function deleteMensagem(mensagemID) {
    // para cada elemento do vetor ele verifica se o id do que eu cliquei é diferente dos que estão no vetor
    // em caso de positivo ele gera um novo vetor newListaMensagem com os valores diferente do id que eu cliquei

    //deletando a mensagem do servidor
    supabaseClient
      .from("mensagem")
      .delete()
      .match({ id: mensagemID })
      .then((response) => {
        console.log("deletei essa mensagem:", response);
      });
  }
  // console.log("MessageList", props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{"@" + mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                type="button"
                label={<MdDeleteOutline />}
                onClick={() => {
                  deleteMensagem(mensagem.id);
                }}
                styleSheet={{
                  height: "10px",
                  width: "20px",
                  marginLeft: "95%",
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  hover: {
                    backgroundColor: appConfig.theme.colors.neutrals[999],
                  },
                }}
              />
            </Box>

            {mensagem.texto.startsWith(":sticker:") ? (
              <Image src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
