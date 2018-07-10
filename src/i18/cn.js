export default {
  cn: {
    translation: {
      common: {
        login: '登录',
        logout: '退出',
        register: '注册',
        projectName: '项目名称',
        token: 'Token',
        status: '状态',
        operation: '操作',
        cancel: '取消',
        confirm: '确认',
        and: '和',
        send: '发送验证码',
        email: '请输入邮箱',
        code: '请输入验证码',
        password: '请输入密码',
        confirmPassword: '请再次输入密码',
        sendSuccess: '发送验证码成功！',
        close: '关闭',
        get: '获取验证码',
        again: '重新获取',
        startTime: '开始时间',
        endTime: '结束时间',
        order: '订单',
        next: '下一步',
        admin: '管理员'
      },
      login: {
        title: '登录',
        forgetPass: '忘记密码？',
        noAccount: '没有账户？',
        create: '创建账户',
        tips: '你还没登录？',
        success: '登录成功'
      },
      register: {
        title: '创建账户',
        terms: '条款',
        policy: '政策',
        agree1: '我在此确认我已经阅读并理解了',
        agree2: '并且我表示接受这些文档中描述的所有条款、权利和义务。 我声明并证明我愿意和购买Vera代币，根据我的管辖权条款和法律。',
        agress3: '我同意在我收到我的代币之前，为KYC提供我的有效身份证和留驻权。' ,
        succuess: '注册成功',
        hadAccount: '已有账户？'
      },
      forget: {
        title: '忘记密码',
        success: '修改密码成功'
      },
      error: {
        email1: '输入你的电子邮箱地址',
        email2: '请输入正确的邮箱地址',
        code: '请输入验证码',
        imgCode: '请输入图形验证码',
        password1: '请输入密码',
        password2: '请输入6-20位字母或者数字',
        password3: '请再次输入密码',
        password4: '两次输入的密码需要一致',
        terms: '请同意条款和条件，以创建账户',
        number: '只能输入小数点后九位'
      },
      home: {

      },
      detail: {
        current: '目前代币的价格',
        btnText: '马上获得代币',
        saled: '已卖代币数：',
        end:  '募集数量'
      },
      wallet: {
        name: '钱包地址',
        walletAddress: '您的接受兼容ERC20的ETH钱包地址',
        ethAddress: '您的支付ETH的钱包地址',
        desc1: '您认购的代币将会在项目认筹结束后，统一打到您提供的接收ERC20代币的钱包地址。',
        desc2: '您需要填写两个以太坊钱包地址，一个是接收地址，用于接收改项目的ERC20代币；另一个是支付地址，用于支付ETH给项目方。',
        desc3: '接收地址必须是能兼容ERC20的ETH钱包地址',
        desc4: '支付地址与您实际支付的地址必须完全相同',
        desc5: '两个地址一旦输入，不可更改',
        desc6: '千万不要使用交易所提供的地址（e.g. Coinbase, Binance, etc）',
        inputTip1: '输入您的收款钱包地址',
        inputTip2: '输入您的发送ETH的钱包地址',
        inputTip3: '输入一个有效的ETH钱包地址(以0x开头及42个字符长度)'
      },
      buyTokens: {
        name: '买代币',
        current: '当前',
        ratio: '认购比例',
        tokenRatio: '代币的认购比例为',
        pay: '支付',
        topay: '您将支付',
        toget: '您将获得',
        min: '最少数额',
        gaslimit: '推荐使用的gas limit',
        gasPrice: 'gas price不少于:',
        send: '发送',
        arrive: '到',
        copy: '复制到剪切板',
        payId: '提供支付证明',
        tradeId: '交易ID',
        tradeIdDesc: '交易ID是什么？',
        inputTip1: '请输入合法的数字',
        inputTip3: '最小购买量为',
        inputTip4: '输入一个有效的TX散列(在您的钱包旁边找到的一个长字符串)',
        error: '交易次数达到上限，不能再次交易'
      },
      confirmation: {
        name: '验证',
        desc1: '在代币销售的结束前',
        desc2: '代币将会发送到你接收ETH（ERC20）的钱包地址',
        gmt: '格林威治标准时间',
        more: '买更多代币',
        orderId: '订单号',
        number: '认购数量',
      },
      sale: {
        alert: '如果您导航离开 ，您输入的TX散列信息将丢失 ，您的订单可能无法确认。请点击以下的确认付款或取消按钮确认或取消您的订单。'
      },
      summaryStatus: {
        0: '未开始',
        1: '已开始',
        2: '已开始',
        3: '已完成',
        4: '失败'
      },
      totalStatus: {
        0: '未开始',
        1: '开始认筹还未到软顶',
        2: '开始认筹还未到硬顶',
        3: '认筹完成且成功',
        4: '认筹完成但失败'
      },
      userTxStatus: {
        0: '未校验',
        1: '交易还未被打包',
        2: '验证成功',
        3: '交易失败',
        4: '交易不存在',
        21: '验证失败',
        22: '验证失败',
        23: '验证失败'
      },
      platformTxStatus: {
        0: '未打币',
        1: '打币中',
        2: '成功',
        3: '失败'
      },
      nav: {
        home: '首页'
      }
    }
  }
}