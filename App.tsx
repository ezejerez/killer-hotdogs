import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, ColorSchemeName, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { ToggleThemeIcon } from "./assets/Icons";
import { palette } from "./styles";

function joinArray(arr: string[]): string {
  if (!arr.length) return "";
  else if (arr.length === 1) return arr[0];
  else if (arr.length === 2) return `${arr[0]} y ${arr[1]}`;
  else {
    const last = arr.slice(-1);
    const rest = arr.slice(0, -1);

    return `${rest.join(", ")} y ${last}`;
  }
}

function getTimeString(hotdogCount: number): string {
  if (!hotdogCount || hotdogCount === 0) return "";

  const intervals = [
    { label: "año", seconds: 31_536_000 },
    { label: "mes", seconds: 2_592_000 },
    { label: "semana", seconds: 604_800 },
    { label: "día", seconds: 86_400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ];

  let remainingTime = hotdogCount * 1800;
  let timeString = "";
  let intervalsAdded: string[] = [];

  for (const interval of intervals) {
    const intervalCount = Math.floor(remainingTime / interval.seconds);
    remainingTime -= intervalCount * interval.seconds;

    const newSanitizedLabel = `${intervalCount} ${interval.label}${
      interval.label === "mes" ? (intervalCount === 1 ? "" : "es") : intervalCount === 1 ? "" : "s"
    }`;

    if (intervalCount > 0) {
      intervalsAdded = [...intervalsAdded, newSanitizedLabel];

      timeString = joinArray(intervalsAdded);
    }
  }

  return timeString;
}

export default function App() {
  const colorScheme = useColorScheme();

  const [hotdogCount, setHotdogCount] = useState<number>(0);
  const [theme, setTheme] = useState(colorScheme);

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

  const handlePressButton = () => setHotdogCount((prev) => prev + 1);

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
        <Button title="Agregar" onPress={handlePressButton} color="#841584" />
      </View>
      <StatusBar />
    </View>
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
