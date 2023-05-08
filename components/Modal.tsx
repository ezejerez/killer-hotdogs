import React from "react";
import { Pressable, Modal as RNModal, StyleSheet, Text, View } from "react-native";

export interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description: string;
  action: () => void;
}

const Modal = ({ open, setOpen, title = "", description = "", action }: ModalProps) => {
  if (!open) return null;

  const handlePressCloseModal = () => setOpen(false);

  const handlePressActionButton = () => {
    action();
    setOpen(false);
  };

  return (
    <View style={styles.centeredView}>
      <RNModal animationType="none" visible={open} transparent onRequestClose={handlePressCloseModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {title && <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 10 }}>{title}</Text>}
            {description && <Text style={styles.modalText}>{description}</Text>}

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
              <Pressable style={[styles.button, styles.buttonAction]} onPress={handlePressActionButton}>
                <Text style={{ ...styles.textStyle, color: "#000" }}>Aceptar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={handlePressCloseModal}>
                <Text style={{ ...styles.textStyle, color: "#fff" }}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: "80%",
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonAction: { backgroundColor: "lightgreen" },

  buttonClose: { backgroundColor: "red" },

  textStyle: { fontWeight: "bold", textAlign: "center" },

  modalText: { marginBottom: 15, textAlign: "center" },
});

export default Modal;
