Page({
  data: {
    customBaskets: [],
    newBasketName: '',
    newBasketWeight: '',
    showAddForm: false
  },

  onLoad() {
    // 从本地存储加载自定义筐类型
    this.loadCustomBaskets();
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadCustomBaskets();
  },

  // 加载自定义筐类型
  loadCustomBaskets() {
    const customBaskets = wx.getStorageSync('customBaskets') || [];
    this.setData({
      customBaskets: customBaskets
    });
  },

  // 显示添加表单
  showAddForm() {
    this.setData({
      showAddForm: true,
      newBasketName: '',
      newBasketWeight: ''
    });
  },

  // 隐藏添加表单
  hideAddForm() {
    this.setData({
      showAddForm: false
    });
  },

  // 输入筐名称
  onBasketNameInput(e) {
    this.setData({
      newBasketName: e.detail.value
    });
  },

  // 输入筐重量
  onBasketWeightInput(e) {
    this.setData({
      newBasketWeight: e.detail.value
    });
  },

  // 添加自定义筐类型
  addCustomBasket() {
    const { newBasketName, newBasketWeight } = this.data;
    
    if (!newBasketName.trim()) {
      wx.showToast({
        title: '请输入筐名称',
        icon: 'none'
      });
      return;
    }

    if (!newBasketWeight || isNaN(parseFloat(newBasketWeight))) {
      wx.showToast({
        title: '请输入有效的筐重量',
        icon: 'none'
      });
      return;
    }

    const weight = parseFloat(newBasketWeight);
    if (weight < 0) {
      wx.showToast({
        title: '筐重量不能为负数',
        icon: 'none'
      });
      return;
    }

    // 检查是否已存在相同名称的筐类型
    const existingBasket = this.data.customBaskets.find(
      basket => basket.name === newBasketName.trim()
    );
    
    if (existingBasket) {
      wx.showToast({
        title: '筐名称已存在',
        icon: 'none'
      });
      return;
    }

    // 添加新的筐类型
    const newBasket = {
      name: newBasketName.trim(),
      weight: weight.toString()
    };

    const updatedBaskets = [...this.data.customBaskets, newBasket];
    
    // 保存到本地存储
    wx.setStorageSync('customBaskets', updatedBaskets);
    
    this.setData({
      customBaskets: updatedBaskets,
      showAddForm: false,
      newBasketName: '',
      newBasketWeight: ''
    });

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除自定义筐类型
  deleteCustomBasket(e) {
    const index = e.currentTarget.dataset.index;
    const basketName = this.data.customBaskets[index].name;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${basketName}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const updatedBaskets = this.data.customBaskets.filter((_, i) => i !== index);
          wx.setStorageSync('customBaskets', updatedBaskets);
          
          this.setData({
            customBaskets: updatedBaskets
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 返回主页
  goBack() {
    wx.navigateBack();
  }
}) 