import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FinancialEducation() {
  const { colors, dark } = useTheme();
  const AFPs = [
    {
      icon: 'business-outline',
      title: '¿Qué son las Administradoras de Pensiones (AFP)?',
      text: 'Son instituciones financieras encargadas de administrar los fondos de pensiones de los trabajadores. Su función principal es invertir los aportes para generar rendimientos y garantizar una pensión al momento del retiro.',
      color: '#1976D2',
    },
    {
      icon: 'trending-up-outline',
      title: '¿Cómo funcionan las AFP?',
      text: 'Cada trabajador aporta mensualmente un porcentaje de su salario. Estos fondos se invierten en distintos instrumentos financieros. Con el tiempo, los rendimientos obtenidos aumentan el capital que servirá para su jubilación.',
      color: '#009688',
    },
    {
      icon: 'people-outline',
      title: 'Tipos de afiliados en una AFP',
      text: 'Existen afiliados activos, que aportan regularmente; afiliados pasivos, que ya reciben una pensión; y afiliados voluntarios, que deciden aportar sin estar obligados por ley.',
      color: '#8E24AA',
    },
    {
      icon: 'cash-outline',
      title: 'Beneficios de estar en una AFP',
      text: 'Permite asegurar ingresos para la vejez, invalidez o fallecimiento. Además, los fondos están individualizados, es decir, pertenecen a cada trabajador y no al gobierno ni a la empresa.',
      color: '#FFA000',
    },
    {
      icon: 'document-text-outline',
      title: 'Tipos de pensión que administran las AFP',
      text: 'Las AFP gestionan pensiones por vejez, invalidez y sobrevivencia, ofreciendo seguridad económica al trabajador o a su familia en distintas etapas de la vida.',
      color: '#E53935',
    },
  ];


  const sections = [
    {
      icon: 'wallet',
      title: '¿Qué es la educación financiera?',
      text: 'Es el conocimiento que te permite administrar de forma inteligente tu dinero. Aprender sobre ingresos, gastos, ahorro, inversión y deuda te ayuda a tomar mejores decisiones y alcanzar estabilidad económica.',
      color: '#4CAF50',
    },
    {
      icon: 'bar-chart',
      title: 'Importancia del presupuesto',
      text: 'El presupuesto es una herramienta que te muestra a dónde va tu dinero. Registra tus ingresos y egresos para saber cuánto puedes ahorrar o invertir cada mes.',
      color: '#FFB300',
    },
    {
      icon: 'cash',
      title: 'Ahorro e inversión',
      text: 'Ahorrar es el primer paso, pero invertir multiplica tus recursos. Empieza creando un fondo de emergencia y luego busca inversiones seguras que se adapten a tus metas.',
      color: '#2196F3',
    },
    {
      icon: 'trending-down',
      title: 'Control de deudas',
      text: 'Endeudarte no siempre es malo, pero hacerlo sin control puede afectar tus finanzas. Prioriza pagar deudas con intereses altos y evita gastos innecesarios.',
      color: '#E53935',
    },
    {
      icon: 'leaf',
      title: 'Consumo responsable',
      text: 'Piensa antes de comprar: ¿realmente lo necesito? Practicar un consumo consciente mejora tu relación con el dinero y con el medio ambiente.',
      color: '#8BC34A',
    },
  ];
  const videos = [
    {
      title: 'Finanzas personales básicas',
      url: 'https://www.youtube.com/watch?v=9sCVcWD1Svs',
      description: 'Aprende los conceptos básicos de finanzas personales y cómo comenzar a administrar tu dinero.',
    },
    {
      title: 'Cómo hacer un presupuesto',
      url: 'https://www.youtube.com/watch?v=yC1cuPL3uD8',
      description: 'Guía paso a paso para crear un presupuesto efectivo y cumplir tus metas financieras.',
    },
    {
      title: 'Inversión para principiantes',
      url: 'https://www.youtube.com/watch?v=Vg4CL6GmvrU',
      description: 'Conceptos básicos de inversión y cómo empezar a multiplicar tus ahorros.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Educación Financiera</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Aprende los fundamentos para tomar mejores decisiones económicas.
        </Text>
        {/*AFPs*/}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>AFPs</Text>
        {AFPs.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: dark ? '#1E1E1E' : '#F8F8F8', borderLeftColor: item.color },
            ]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
          </View>
        ))}

        {/* Información General*/}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Información General</Text>
        {sections.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: dark ? '#1E1E1E' : '#F8F8F8', borderLeftColor: item.color },
            ]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
          </View>
        ))}

        {/* Sección de videos */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Videos Educativos</Text>
        {videos.map((video, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.videoCard, { backgroundColor: dark ? '#1E1E1E' : '#F0F0F0' }]}
            onPress={() => Linking.openURL(video.url)}
          >
            <View style={styles.videoHeader}>
              <Ionicons name="play-circle" size={28} color="#E53935" />
              <Text style={[styles.videoTitle, { color: colors.text }]}>{video.title}</Text>
            </View>
            <Text style={[styles.videoDescription, { color: colors.text }]}>{video.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.tipContainer, { backgroundColor: dark ? '#222' : '#E3F2FD' }]}>
          <Ionicons name="bulb" size={26} color="#FFC107" />
          <Text style={[styles.tipText, { color: colors.text }]}>
            💡 Consejo: registra tus gastos diariamente, aunque sean pequeños.
            Esa información te ayudará a entender tus hábitos y mejorar tus finanzas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 50 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 16, marginBottom: 20, opacity: 0.8 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '600' },
  text: { fontSize: 15, lineHeight: 22 },
  sectionHeader: { fontSize: 20, fontWeight: '700', marginVertical: 12 },
  videoCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  videoTitle: { fontSize: 16, fontWeight: '600' },
  videoDescription: { fontSize: 14, lineHeight: 20 },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  tipText: { fontSize: 15, flex: 1, lineHeight: 22 },
});