import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, ColorSchemeName, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { ToggleThemeIcon } from "./assets/Icons";
import Modal, { ModalProps } from "./components/Modal";
import { palette } from "./styles";
import { getTimeString } from "./utils";

const MODAL_PROPS: { [key: string]: Pick<ModalProps, "title" | "description"> } = {
  add: {
    title: "Añadir",
    description: "¿Estás seguro/a de añadir 1 pancho?",
  },

  remove: {
    title: "Eliminar",
    description: "¿Estás seguro/a de eliminar 1 pancho?",
  },

  reset: {
    title: "Reiniciar",
    description: "¿Estás seguro/a de reiniciar tu historial?",
  },
};

export default function App() {
  const colorScheme = useColorScheme();

  const [hotdogCount, setHotdogCount] = useState<number>(0);
  const [theme, setTheme] = useState(colorScheme);
  const [openModal, setOpenModal] = useState<ModalProps["open"]>(false);
  const [modalProps, setModalProps] = useState<Omit<ModalProps, "open" | "setOpen">>();

  const styles = getStyles(theme);

  const storageKey = "killer-panchos-storage";
  const timeString = getTimeString(hotdogCount);

  const storeData = async (key: string, value: { [key: string]: any }) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePressAddButton = () => {
    setModalProps({ ...MODAL_PROPS.add, action: () => setHotdogCount((prev) => prev + 1) });
    setOpenModal(true);
  };

  const handlePressRemoveButton = () => {
    setModalProps({ ...MODAL_PROPS.remove, action: () => setHotdogCount((prev) => prev - 1) });
    setOpenModal(true);
  };

  const handlePressResetButton = () => {
    setModalProps({ ...MODAL_PROPS.reset, action: () => setHotdogCount(0) });
    setOpenModal(true);
  };

  const handleToggleTheme = () => (theme === "light" ? setTheme("dark") : setTheme("light"));

  const MainText = () => (
    <Text style={styles.mainText}>
      {hotdogCount ? (
        <Text>
          Hasta la fecha comiste <Text style={{ fontWeight: "700" }}>{hotdogCount}</Text> pancho{hotdogCount > 1 ? "s" : ""}. {hotdogCount >= 10 ? "😱" : ""}
        </Text>
      ) : (
        "Aún no comiste ningún pancho."
      )}
    </Text>
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(storageKey);

        if (data !== null) {
          const parsedData = JSON.parse(data);

          setHotdogCount(parsedData.hotdogCount);
          setTheme(parsedData.theme);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    storeData(storageKey, { hotdogCount, theme });
  }, [hotdogCount, theme]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.themeToggler}>
          <TouchableOpacity onPress={handleToggleTheme}>
            <ToggleThemeIcon width={25} height={25} fill={palette[theme || "light"].color} />
          </TouchableOpacity>
        </View>

        <Image source={require("./assets/logo.png")} style={{ height: 130, width: 130 }} />
        <View style={{ justifyContent: "space-between", height: 400 }}>
          <MainText />

          {hotdogCount ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryText}>Lo cual equivale a</Text>
              <Text style={styles.timeStats}>{timeString}</Text>
              <Text style={styles.secondaryText}>menos de vida 💀</Text>
            </View>
          ) : null}
          <View style={{ justifyContent: "space-evenly", height: 150 }}>
            <Button title={MODAL_PROPS.add.title!} onPress={handlePressAddButton} color="#841584" />
            {hotdogCount ? (
              <>
                <Button title={MODAL_PROPS.remove.title!} onPress={handlePressRemoveButton} color="#841584" />
                <Button title={MODAL_PROPS.reset.title!} onPress={handlePressResetButton} color="#841584" />
              </>
            ) : null}
          </View>
        </View>
        <StatusBar />
      </View>

      {modalProps && <Modal open={openModal} setOpen={setOpenModal} {...modalProps} />}
    </>
  );
}

const getStyles = (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: palette[theme || "light"].backgroundColor,
      alignItems: "center",
      justifyContent: "space-around",
      color: palette[theme || "light"].color,
      paddingLeft: 15,
      paddingRight: 15,
      textAlign: "center",
    },

    mainText: {
      textAlign: "center",
      color: palette[theme || "light"].color,
      fontSize: 18,
    },

    secondaryText: {
      color: palette[theme || "light"].color,
      fontWeight: "500",
      fontSize: 18,
    },

    timeStats: {
      color: palette[theme || "light"].color,
      fontWeight: "700",
      fontSize: 24,
    },

    themeToggler: {
      width: "100%",
      position: "absolute",
      alignItems: "flex-end",
      paddingRight: 15,
    },
  });
