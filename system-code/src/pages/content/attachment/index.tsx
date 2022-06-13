import {
  Pagination,
  Button,
  Space,
  Row,
  Col,
  Image,
  Modal,
  Input,
  message,
  Checkbox,
  Popover,
  Table,
  Select,
  Empty,
  Upload,
  Card,
  Avatar,
} from 'antd';
import React from 'react';
import './index.less';
import { LoadingOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  changeAttachmentCategory,
  deleteAttachment,
  getAttachmentCategories,
  getAttachments,
  uploadAttachment,
} from '@/services/attachment';
import AttachmentCategory from './components/category';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import moment from 'moment';
import { sizeFormat } from '@/utils';

export default class ImageList extends React.Component {
  state: {[key: string]: any} = {
    images: [],
    fetched: false,
    total: 0,
    page: 1,
    limit: 18,
    selectedIds: [],
    addImageVisible: false,
    categories: [],
    categoryId: 0,
    tmpCategoryId: 0,
    currentAttach: {},
    detailVisible: false,
  };

  componentDidMount() {
    this.getImageList();
    this.getCategories();
  }

  getImageList = () => {
    const { page, limit, categoryId } = this.state;
    getAttachments({
      current: page,
      pageSize: limit,
      category_id: categoryId,
    })
      .then((res) => {
        this.setState({
          images: res.data,
          total: res.total,
          fetched: true,
        });
      })
      .catch((err) => {});
  };

  getCategories = () => {
    getAttachmentCategories().then((res) => {
      this.setState({
        categories: res.data || [],
      });
    });
  };

  handleUploadImage = (e: any) => {
    const { categoryId } = this.state;
    let formData = new FormData();
    formData.append('file', e.file);
    formData.append('category_id', categoryId + "");
    uploadAttachment(formData).then((res) => {
      message.info(res.msg);
      this.getImageList();
    });
  };

  handleDeleteImage = () => {
    Modal.confirm({
      title: '确定要删除选中的图片吗？',
      content: '删除后，调用这个资源的文档和页面，或出现图片资源加载404错误，请确保没有地方引用这个资源再进行删除操作。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const { selectedIds } = this.state;
        for (let id of selectedIds) {
          let res = await deleteAttachment({
            id: id,
          });
          message.info(res.msg);
        }
        this.setState({
          selectedIds: [],
        });
        this.hideAttachDetail();
        this.getImageList();
      },
    });
  };

  onChangeSelect = (e: any) => {
    this.setState({
      selectedIds: e,
    });
  };

  onChangePage = (page: number, pageSize?: number) => {
    const { limit } = this.state;
    this.setState(
      {
        page: page,
        limit: pageSize ? pageSize : limit,
      },
      () => {
        this.getImageList();
      },
    );
  };

  handleChangeCategory = async (e: any) => {
    this.setState(
      {
        categoryId: e,
        page: 1,
      },
      () => {
        this.getImageList();
      },
    );
  };

  handleSetTmpCategoryId = (e: any) => {
    this.setState(
      {
        tmpCategoryId: e,
      });
  }

  handleUpdateToCategory = async (e: any) => {
    const {tmpCategoryId, categories} = this.state
    Modal.confirm({
      icon: '',
      title: '移动到新分类',
      content: <div>
        <Select
          defaultValue={tmpCategoryId}
          onChange={this.handleSetTmpCategoryId}
          style={{ width: 200 }}
        >
          <Select.Option value={0}>未分类</Select.Option>
          {categories.map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </div>,
      onOk: () => {
        let {selectedIds, tmpCategoryId} = this.state
        changeAttachmentCategory({
          category_id: tmpCategoryId,
          ids: selectedIds,
        }).then(res => {
          message.info(res.msg)
          this.getImageList();
        })
      }
    })
  };

  handlePreview = (item: any) => {
    this.setState({
      currentAttach: item,
      detailVisible: true,
    })
  }

  hideAttachDetail = () => {
    this.setState({
      detailVisible: false,
    })
  }

  handleRemoveAttach = () => {
    const {currentAttach} = this.state;
    this.setState({
      selectedIds: [currentAttach.id],
    }, () => {
      this.handleDeleteImage();
    });
  }

  handleReplaceAttach = (e: any) => {
    const {currentAttach} = this.state;
    let formData = new FormData();
    formData.append('file', e.file);
    formData.append('replace', "true");
    formData.append('id', currentAttach.id);
    uploadAttachment(formData).then((res) => {
      message.info(res.msg);
      currentAttach.updated_time = (new Date()).getTime();
      this.setState({
        currentAttach,
      })
      this.getImageList();
    });
  }

  render() {
    const { images, total, limit, categories, categoryId, fetched, selectedIds, currentAttach, detailVisible } = this.state;

    return (
      <PageContainer>
        <Card
          className="image-page"
          title="图片资源管理"
          extra={
            <div className="meta">
              <Space size={16}>
                <span>分类筛选</span>
                <Select
                  defaultValue={categoryId}
                  style={{ width: 120 }}
                  onChange={this.handleChangeCategory}
                >
                  <Select.Option value={0}>全部资源</Select.Option>
                  {categories.map((item: any) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>
                <AttachmentCategory
                  onCancel={() => {
                    this.getCategories();
                  }}
                >
                  <Button
                    key="category"
                    onClick={() => {
                      //todo
                    }}
                  >
                    分类管理
                  </Button>
                </AttachmentCategory>
                <Upload
                  name="file"
                  showUploadList={false}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  customRequest={this.handleUploadImage}
                >
                  <Button type="primary">上传新图片</Button>
                </Upload>
                {selectedIds.length > 0 && (
                  <>
                  <Button className="btn-gray" onClick={this.handleUpdateToCategory}>
                    移动到新分类
                  </Button>
                  <Button className="btn-gray" onClick={this.handleDeleteImage}>
                    批量删除图片
                  </Button>
                  </>
                )}
              </Space>
            </div>
          }
        >
          <div className="body">
            <Checkbox.Group onChange={this.onChangeSelect} style={{ display: 'block' }}>
              {!fetched ? (
                <Empty
                  className="empty-normal"
                  image={<LoadingOutlined style={{ fontSize: '72px' }} />}
                  description="加载中..."
                ></Empty>
              ) : total > 0 ? (
                <Row gutter={[16, 16]} className="image-list">
                  {images?.map((item: any) => (
                    <Col span={4} key={item.id}>
                      <div className="image-item">
                        <div className="inner">
                          <Checkbox className="checkbox" value={item.id} />
                          <div className='link' onClick={this.handlePreview.bind(this, item)}>
                          {item.thumb ? (
                            <Image
                              className="img"
                              preview={false}
                              src={item.thumb + '?t=' + item.updated_time}
                              alt={item.file_name}
                            />
                          ) : (
                            <Avatar className="default-img" size={120}>
                              {item.file_location.substring(item.file_location.lastIndexOf('.'))}
                            </Avatar>
                          )}
                          </div>
                          <div className="info">
                            <div>{item.file_name}</div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty className="empty-normal" description="图片夹空空如也">
                  <Upload
                    name="file"
                    showUploadList={false}
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    customRequest={this.handleUploadImage}
                  >
                    <Button type="primary">添加图片</Button>
                  </Upload>
                </Empty>
              )}
            </Checkbox.Group>
            {total > 0 && (
              <Pagination
                defaultCurrent={1}
                defaultPageSize={limit}
                total={total}
                showSizeChanger={true}
                onChange={this.onChangePage}
                style={{ marginTop: '20px' }}
              />
            )}
          </div>
        </Card>
        <Modal width={900} title={'查看资源详情'} onCancel={this.hideAttachDetail} onOk={this.hideAttachDetail} visible={detailVisible}>
          <div className='attachment-detail'>
            <div className='preview'>
              <Image
                width={'100%'}
                className="img"
                preview={{
                  src: currentAttach.logo + '?t=' + currentAttach.updated_time,
                }}
                src={currentAttach.logo + '?t=' + currentAttach.updated_time}
                alt={currentAttach.file_name}
              />
            </div>
            <div className='detail'>
            <div className='info'>
              <div className='item'>
                <div className='name'>文件名:</div>
                <div className='value'>{currentAttach.file_name}</div>
              </div>
              <div className='item'>
                <div className='name'>文件类型:</div>
                <div className='value'>{currentAttach.file_location?.substring(currentAttach.file_location?.lastIndexOf('.'))}</div>
              </div>
              <div className='item'>
                <div className='name'>上传于:</div>
                <div className='value'>{moment(currentAttach.updated_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
              <div className='item'>
                <div className='name'>文件大小:</div>
                <div className='value'>{sizeFormat(currentAttach.file_size)}</div>
              </div>
              <div className='item'>
                <div className='name'>分辨率:</div>
                <div className='value'>{currentAttach.width + "×" + currentAttach.height}</div>
              </div>
              <div className='item'>
                <div className='name'>图片地址:</div>
                <div className='value'>{currentAttach.logo}</div>
              </div>
            </div>
            <Space size={16} align='center' className='btns'>
              <Upload
                  name="file"
                  showUploadList={false}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  customRequest={this.handleReplaceAttach}
                >
                  <Button>替换图片</Button>
              </Upload>
              <Button onClick={this.handleRemoveAttach}>删除图片</Button>
              <Button danger onClick={this.hideAttachDetail}>关闭</Button>
            </Space>
            <div className='tips'>
              <p>相关说明：</p>
              <div>1、替换图片时，图片的URL地址不变，图片大小变为新图片的。</div>
              <div>2、为避免页面受大图影响，当图片过大时，自动按设置的图片大小进行同比例缩小。</div>
              <div>4、图片上传后，如果后台更新了，但前台未更新，请清理本地浏览器缓存。</div>
            </div>
            </div>
          </div>
        </Modal>
      </PageContainer>
    );
  }
}
