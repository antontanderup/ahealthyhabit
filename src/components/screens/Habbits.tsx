import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import i18n from 'i18n-js';
import { Habbit as HabbitType, RootState } from '../../store';
import Habbit from '../Habbit';
import EditHabbit from '../EditHabbit';


const Habbits = ({ habbits }: { habbits: RootState['habbits'] }) => {

    const { colors } = useTheme();

    const [showAddHabbit, setShowAddHabbit] = useState(false);

    const renderHabbit = ({ item }: { item: HabbitType }) => {
        return <Habbit habbit={item} />
    }

    const flatListData = Object.values(habbits);

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <Appbar.Header>
                <Appbar.Content title={i18n.t("appName")} />
            </Appbar.Header>
            <FlatList
                data={flatListData}
                renderItem={renderHabbit}
            />
            { !showAddHabbit ? (
                <FAB
                    style={{ position: 'absolute', bottom: 0, right: 0, margin: 16 }}
                    icon="plus"
                    onPress={() => setShowAddHabbit(true)}
                />
            ) : (
                <EditHabbit isOpen={showAddHabbit} onClose={() => setShowAddHabbit(false)} />
            )}

        </View>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        habbits: state.habbits
    }
}

export default connect(mapStateToProps)(Habbits);