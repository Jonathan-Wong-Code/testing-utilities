import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, H3 } from 'web_component_library';
import PageContainer from '../pageContainer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

import { colors } from '../../theme/defaultTheme';

import {
  loadDeviceListModel,
  loadByopDetailModel,
} from '../contentfulHOC/actions';
import {
  makeDeviceListModel,
  makeByopListModel,
} from '../contentfulHOC/selectors';

import { makeSelectDeviceList } from './selector';
import { deviceListRequest } from './actions';
import { useInjectReducer } from '../../utils/injectReducer';
import { extractImageAsset } from '../../utils/misc';
import DeviceListDisplay from '../../components/deviceListDisplay';

const key = 'deviceList';
function DeviceList() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const deviceListfromAPI = useSelector(makeSelectDeviceList());
  const deviceListModelData = useSelector(makeDeviceListModel);

  const dispatch = useDispatch();

  const [deviceList, setDeviceList] = useState([]);
  const [contentfulDeviceList, setContentfulDeviceList] = useState([]);
  const [BYOPCF, setBYOPCF] = useState({});

  const byopModelData = useSelector(makeByopListModel);

  useEffect(() => {
    dispatch(deviceListRequest());

    setTimeout(() => {
      dispatch(loadByopDetailModel());
    }, 0);
  }, []);

  useEffect(() => {
    if (deviceListfromAPI && deviceListfromAPI.deviceList) {
      setDeviceList(deviceListfromAPI.deviceList.data);

      // creating array of skus from devices
      const skuArray = deviceListfromAPI.deviceList.data.map(({ sku }) => sku);
      const byopsku = '000000000000';
      const combinedSku = [...skuArray, byopsku];

      const formattedSku = combinedSku.join(',');

      setTimeout(() => {
        dispatch(
          loadDeviceListModel({
            sku: formattedSku,
          }),
        );
      }, 0);
    }
  }, [deviceListfromAPI]);

  useEffect(() => {
    if (byopModelData && byopModelData.items) {
      setBYOPCF(byopModelData.items[0].fields);
    }
  }, [byopModelData]);

  useEffect(() => {
    if (deviceListModelData) {
      const fieldData = deviceListModelData.items.map(item => ({
        id: item.sys.id,
        ...item.fields,
      }));

      // constructs the slider assets for the device card images
      const cardData = fieldData.map(device => {
        const newSliderAssets = extractImageAsset(device.sliderAssets[0]);
        return {
          ...device,
          sliderAssets: newSliderAssets,
        };
      });

      if (deviceList && deviceList.length > 0) {
        const deviceListObj = deviceList.reduce((accumulator, device) => {
          accumulator[device.sku] = device;
          return accumulator;
        }, {});

        const mergedAndFiltered = cardData.map(item => {
          const devices = deviceListObj[item.sku];

          let combinedBYOP;

          const formattedData = {
            make: BYOPCF.manufacturer,
            model: BYOPCF.modelName,
          };

          if (item.sku === '000000000000') {
            combinedBYOP = { ...item, ...formattedData };
          }

          return { ...devices, ...item, ...combinedBYOP };
        });

        setContentfulDeviceList(mergedAndFiltered);
      }
    }
  }, [deviceListModelData]);

  return (
    <PageContainer bg={colors.grey}>
      <Box variant="container" px={[12, 0]}>
        <H3>Device List</H3>
        <DeviceListDisplay contentfulDeviceList={contentfulDeviceList} />
      </Box>
    </PageContainer>
  );
}

export default DeviceList;
