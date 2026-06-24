import React from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {Stack} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSettingsStore} from '../../store';
import {useTheme, createUseStyles} from '../../theme';

const PRESET_COLORS = [
  '#04c96a',
  '#2196F3',
  '#9C27B0',
  '#F44336',
  '#FF9800',
  '#009688',
  '#E91E63',
  '#3F51B5',
  '#795548',
  '#607D8B',
];

export default function Settings() {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const themeColor = useSettingsStore(state => state.themeColor);
  const changeThemeColor = useSettingsStore(state => state.changeThemeColor);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('settings'),
          headerStyle: {backgroundColor: theme.surface},
          headerTintColor: theme.onSurfaceVariant,
          headerTitleStyle: {color: theme.onSurface},
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 24},
        ]}>
        <Text style={styles.sectionTitle}>{t('themeColor')}</Text>

        <Pressable
          style={({pressed}) => [
            styles.systemColorRow,
            themeColor === null && styles.systemColorRowSelected,
            pressed && styles.pressed,
          ]}
          onPress={() => changeThemeColor(null)}>
          <View style={styles.systemColorIcon}>
            <MaterialCommunityIcons
              name="palette-outline"
              size={22}
              color={themeColor === null ? theme.primary : theme.onSurfaceVariant}
            />
          </View>
          <Text
            style={[
              styles.systemColorLabel,
              themeColor === null && styles.systemColorLabelSelected,
            ]}>
            {t('systemColor')}
          </Text>
          {themeColor === null && (
            <MaterialCommunityIcons name="check" size={20} color={theme.primary} />
          )}
        </Pressable>

        <View style={styles.colorGrid}>
          {PRESET_COLORS.map(color => (
            <Pressable
              key={color}
              onPress={() => changeThemeColor(color)}
              style={({pressed}) => [
                styles.colorSwatchWrapper,
                pressed && styles.pressed,
              ]}>
              <View
                style={[
                  styles.colorSwatch,
                  {backgroundColor: color},
                  themeColor === color && styles.colorSwatchSelected,
                ]}>
                {themeColor === color && (
                  <MaterialCommunityIcons name="check" size={22} color="#ffffff" />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const useStyles = createUseStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: theme.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  systemColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.surfaceContainer,
    marginBottom: 16,
  },
  systemColorRowSelected: {
    backgroundColor: theme.primaryContainer,
  },
  systemColorIcon: {
    width: 32,
    alignItems: 'center',
  },
  systemColorLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.onSurface,
  },
  systemColorLabelSelected: {
    color: theme.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatchWrapper: {
    borderRadius: 28,
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: theme.outline,
  },
}));
