Page({
  data: {
    // 水果种类数据
    fruitNames: ['苹果', '香蕉', '葡萄', '橙子', '西瓜', '草莓', '梨', '芒果', '菠萝', '桃子', '猕猴桃', '樱桃', '李子', '蓝莓', '柠檬', '石榴', '哈密瓜', '火龙果', '椰子', '杏', '荔枝', '车厘子', '其他'],
    fruitValues: ['apple', 'banana', 'grape', 'orange', 'watermelon', 'strawberry', 'pear', 'mango', 'pineapple', 'peach', 'kiwi', 'cherry', 'plum', 'blueberry', 'lemon', 'pomegranate', 'cantaloupe', 'dragonfruit', 'coconut', 'apricot', 'litchi', 'cherryking', 'other'],
    fruitIndex: 0,
    
    // 筐类型数据
    basketNames: ['无', '4.5斤筐', '5斤筐', '2.5斤筐'],
    basketValues: ['0', '4.5', '5', '2.5'],
    basketIndex: 0,
    
    // 表单数据
    standardWeight: '10',
    basketWeight: '4.5',
    grossPrice: '',
    netPrice: '',
    lossRate: '',
    distance: '6',
    marketPrice: '',
    transCost: '0.05',
    profitRate: '20',
    
    // 计算结果
    showResult: false,
    costAfterLoss: '',
    transportCost: '',
    totalCost: '',
    groupPrice: '',
    offlinePrice: '',
    marketSuggest: '',
    
    // 内置水果平均损耗率
    fruitLossRates: {
      apple: 5,
      banana: 10,
      grape: 12,
      orange: 8,
      watermelon: 4,
      strawberry: 15,
      pear: 6,
      mango: 9,
      pineapple: 13,
      peach: 10,
      kiwi: 11,
      cherry: 14,
      plum: 9,
      blueberry: 16,
      lemon: 7,
      pomegranate: 8,
      cantaloupe: 5,
      dragonfruit: 7,
      coconut: 3,
      apricot: 12,
      litchi: 13,
      cherryking: 10,
      other: 8
    }
  },

  onLoad() {
    // 页面加载时设置默认损耗率和筐重
    this.setAvgLossRate();
    this.loadBasketTypes();
    this.setBasketWeight();
  },

  onShow() {
    // 每次显示页面时重新加载筐类型
    this.loadBasketTypes();
  },

  // 水果选择改变
  onFruitChange(e) {
    this.setData({
      fruitIndex: e.detail.value
    });
    this.setAvgLossRate();
  },

  // 筐类型选择改变
  onBasketChange(e) {
    this.setData({
      basketIndex: e.detail.value
    });
    this.setBasketWeight();
    this.calculateNetPrice();
  },

  // 设置平均损耗率
  setAvgLossRate() {
    const fruitValue = this.data.fruitValues[this.data.fruitIndex];
    const avgLossRate = this.data.fruitLossRates[fruitValue];
    this.setData({
      lossRate: avgLossRate.toString()
    });
  },

  // 加载筐类型（包括自定义筐类型）
  loadBasketTypes() {
    // 默认筐类型
    const defaultBaskets = [
      { name: '无', value: '0' },
      { name: '4.5斤筐', value: '4.5' },
      { name: '5斤筐', value: '5' },
      { name: '2.5斤筐', value: '2.5' }
    ];

    // 从本地存储获取自定义筐类型
    const customBaskets = wx.getStorageSync('customBaskets') || [];
    
    // 将自定义筐类型的weight字段转换为value字段
    const convertedCustomBaskets = customBaskets.map(basket => ({
      name: basket.name,
      value: basket.weight
    }));
    
    // 合并默认筐类型和自定义筐类型
    const allBaskets = [...defaultBaskets, ...convertedCustomBaskets];
    
    const basketNames = allBaskets.map(basket => basket.name);
    const basketValues = allBaskets.map(basket => basket.value);
    
    this.setData({
      basketNames: basketNames,
      basketValues: basketValues
    });
  },

  // 设置筐重
  setBasketWeight() {
    const basketValue = this.data.basketValues[this.data.basketIndex];
    this.setData({
      basketWeight: basketValue
    });
  },

  // 计算净单价
  calculateNetPrice() {
    const grossPrice = parseFloat(this.data.grossPrice);
    const standardWeight = parseFloat(this.data.standardWeight);
    const basketWeight = parseFloat(this.data.basketWeight);
    
    if (grossPrice && standardWeight) {
      let netPrice;
      if (basketWeight === 0) {
        // 当筐重为0时，净单价等于毛单价
        netPrice = grossPrice;
      } else {
        // 新的净单价计算公式
        netPrice = (grossPrice * standardWeight) / (standardWeight - basketWeight);
      }
      
      this.setData({
        netPrice: netPrice.toFixed(2)
      });
    }
  },

  // 输入事件处理
  onStandardWeightInput(e) {
    this.setData({
      standardWeight: e.detail.value
    });
    this.calculateNetPrice();
  },

  onGrossPriceInput(e) {
    this.setData({
      grossPrice: e.detail.value
    });
    this.calculateNetPrice();
  },

  onLossRateInput(e) {
    this.setData({
      lossRate: e.detail.value
    });
  },

  onDistanceInput(e) {
    this.setData({
      distance: e.detail.value
    });
  },

  onMarketPriceInput(e) {
    this.setData({
      marketPrice: e.detail.value
    });
  },

  onTransCostInput(e) {
    this.setData({
      transCost: e.detail.value
    });
  },

  onProfitRateInput(e) {
    this.setData({
      profitRate: e.detail.value
    });
  },

  // 计算价格
  calcPrice(e) {
    // 获取输入值
    const standardWeight = parseFloat(this.data.standardWeight);
    const basketWeight = parseFloat(this.data.basketWeight);
    const grossPrice = parseFloat(this.data.grossPrice);
    const netPrice = parseFloat(this.data.netPrice);
    const lossRate = parseFloat(this.data.lossRate) / 100;
    const distance = parseFloat(this.data.distance);
    const marketPrice = parseFloat(this.data.marketPrice) || null;
    const transCost = parseFloat(this.data.transCost);
    const profitRate = parseFloat(this.data.profitRate) / 100;

    // 验证输入
    if (!standardWeight || !grossPrice || !netPrice || !lossRate || !distance || !transCost || !profitRate) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 使用净单价作为成本价
    const costPrice = netPrice;
    
    // 损耗后成本
    const costAfterLoss = costPrice / (1 - lossRate);
    // 运输成本
    const transportCost = distance * transCost;
    // 总成本
    const totalCost = costAfterLoss + transportCost;
    // 建议开团价（利润率）
    let groupPrice = totalCost * (1 + profitRate);
    // 调整开团价为以.9结尾
    groupPrice = Math.floor(groupPrice) + 0.9;
    // 建议线下售价（至少高于开团价2元）
    let offlinePrice = groupPrice + 2;

    // 市场竞争力建议
    let marketSuggest = '';
    if (marketPrice) {
      const suggestGroup = marketPrice * 0.95;
      if (groupPrice > suggestGroup) {
        marketSuggest = `建议开团价高于市场价95%（${suggestGroup.toFixed(2)}元/斤），可适当下调以增强竞争力。`;
      } else {
        marketSuggest = `建议开团价已低于市场价95%（${suggestGroup.toFixed(2)}元/斤），具有竞争优势。`;
      }
    }

    // 更新结果
    this.setData({
      showResult: true,
      costAfterLoss: costAfterLoss.toFixed(2),
      transportCost: transportCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      groupPrice: groupPrice.toFixed(1),
      offlinePrice: offlinePrice.toFixed(1),
      marketSuggest: marketSuggest
    }, () => {
      // 计算完成后滚动到页面底部
      this.scrollToBottom();
    });
  },

  // 跳转到设置页面
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 滚动到页面底部
  scrollToBottom() {
    wx.pageScrollTo({
      scrollTop: 9999,
      duration: 300
    });
  }
}) 